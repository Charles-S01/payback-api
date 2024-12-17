const { Router } = require("express")
const prisma = require("../prisma/prisma")
const loginRouter = Router()
var jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

loginRouter.post("/", async (req, res) => {
    const { username, password } = req.body
    const retreivedUser = await prisma.user.findUnique({
        where: {
            username: username,
        },
    })
    if (!retreivedUser) {
        console.log("Invalid username!")
        return res.status(400).json({ errorMessage: "Username not found" })
    }
    const match = await bcrypt.compare(password, retreivedUser.password)
    if (!match) {
        console.log("Invalid password")
        return res.status(400).json({ errorMessage: "Invalid password" })
    }

    jwt.sign(
        {
            id: retreivedUser.id,
        },
        "secretKey",
        // { expiresIn: "5s" },
        (error, token) => {
            if (error) {
                return res.json({
                    errorMessage: "There was an error signing the token",
                })
            }
            res.json({ token: token, message: "Successfuly logged in" })
        }
    )
})

module.exports = loginRouter
