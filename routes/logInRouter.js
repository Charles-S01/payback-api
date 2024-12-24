const { Router } = require("express")
const prisma = require("../prisma/prisma")
const loginRouter = Router()
var jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

loginRouter.post("/", async (req, res, next) => {
    console.log("login post ran")
    try {
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

        const token = jwt.sign(
            {
                id: retreivedUser.id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        )

        const refreshToken = jwt.sign(
            {
                id: retreivedUser.id,
                username: retreivedUser.username,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "15d" }
        )

        // Assigning refresh token in http-only cookie
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.json({ token, refreshToken, message: "Successfuly logged in" })
    } catch (err) {
        next(err)
    }
})

module.exports = loginRouter
