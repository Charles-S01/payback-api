const { Router } = require("express")
const prisma = require("../prisma/prisma")
const { verifyToken } = require("../verifyToken")
const userDataRouter = Router()
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")

// search for users
userDataRouter.get("/search/:userId?", verifyToken, async (req, res, next) => {
    try {
        // console.log("users search ran")
        const { firstName, lastName, username } = req.query
        const { userId } = req.params

        const users = await prisma.user.findMany({
            where: {
                ...(userId && { id: userId }),
                ...(firstName && { firstName: { startsWith: firstName, mode: "insensitive" } }),
                ...(lastName && { lastName: { startsWith: lastName, mode: "insensitive" } }),
                ...(username && { username: { startsWith: username, mode: "insensitive" } }),
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
            },
        })
        // console.log(users)
        res.json({ users })
    } catch (err) {
        next(err)
    }
})

// get logged in user data
userDataRouter.get("/", verifyToken, async (req, res, next) => {
    // console.log("users get / ran")

    try {
        const userId = req.user.id
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
        // console.log(user)
        res.json({ user })
    } catch (err) {
        next(err)
    }
})

userDataRouter.put("/", verifyToken, async (req, res, next) => {
    try {
        // const { userId } = req.params
        const { firstName, lastName } = req.body

        const updatedUser = await prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                firstName: firstName,
                lastName: lastName,
            },
        })

        res.json({ message: "Updated user successfuly", updatedUser })
    } catch (err) {
        next(err)
    }
})

module.exports = userDataRouter
