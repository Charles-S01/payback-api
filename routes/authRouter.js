const { Router } = require("express")
const prisma = require("../prisma/prisma")
const { verifyToken } = require("../verifyToken")
const authRouter = Router()
var jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require("uuid")

authRouter.post("/sign-up", async (req, res, next) => {
    try {
        // console.log("userData post middleware ran")
        const { firstName, lastName, username, password } = req.body

        const foundUsername = await prisma.user.findUnique({
            where: {
                username: username,
            },
        })
        if (foundUsername) {
            return res.status(400).json({ message: "Username already exists" })
        }

        bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) return next(err)

            const user = await prisma.user.create({
                data: {
                    id: uuidv4(),
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    password: hashedPassword,
                },
            })
            const users = await prisma.user.findMany()
            console.log(users)
            res.json({ message: "Successfully added user", user })
        })
    } catch (error) {
        next(error)
    }
})

authRouter.post("/log-in", async (req, res, next) => {
    // console.log("login post ran")
    try {
        const { username, password } = req.body
        const retreivedUser = await prisma.user.findUnique({
            where: {
                username: username,
            },
        })
        if (!retreivedUser) {
            // console.log("Invalid username!")
            return res.status(400).json({ message: "Username not found" })
        }
        const match = await bcrypt.compare(password, retreivedUser.password)
        if (!match) {
            // console.log("Invalid password")
            return res.status(400).json({ message: "Invalid password" })
        }

        const token = generateAccessToken(retreivedUser)

        const refreshToken = generateRefreshToken(retreivedUser)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
        })

        res.json({ token, refreshToken, message: "Successfuly logged in" })
    } catch (err) {
        next(err)
    }
})

authRouter.post("/refresh", (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token found" })
        }
        // console.log("/refresh refresh token:", refreshToken)

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized. Refresh token verification failed" })
            }

            // console.log("decodedToken:", decoded)
            const token = generateAccessToken(decoded)
            // console.log("new access token:", token)
            res.json({ token })
        })
    } catch (error) {
        next(error)
    }
})

function generateAccessToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}
function generateRefreshToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "15d" })
}

module.exports = authRouter
