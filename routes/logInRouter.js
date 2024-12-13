const { Router } = require("express")
const prisma = require("../prisma/prisma")
const loginRouter = Router()
var jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

loginRouter.post("/", async (req, res) => {
    const { username, password } = req.body
    const user = await prisma.user.findUnique({
        where: {
            username: username,
            // password: password,
        },
    })
    if (!user) {
        console.log("Invalid username!")
        return res.status(400).json({ errorMessage: "Invalid username" })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        console.log("Invalid password")
        return res.status(400).json({ errorMessage: "Invalid password" })
    }

    jwt.sign(
        {
            id: user.id,
            // firstName: user.firstName,
            // lastName: user.lastName,
            // username: user.username,
        },
        "secretKey",
        // { expiresIn: "5s" },
        (error, token) => {
            if (error) {
                return res.json({
                    error: "There was an error signing the token",
                })
            }
            res.json({ token: token, message: "Successfuly logged in" })
        }
    )
})

module.exports = loginRouter
