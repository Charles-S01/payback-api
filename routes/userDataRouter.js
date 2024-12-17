const { Router } = require("express")
const prisma = require("../prisma/prisma")
const { verifyToken } = require("../verifyToken")
const userDataRouter = Router()
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")

userDataRouter.get("/", verifyToken, async (req, res, next) => {
    try {
        const userId = req.user.id
        const userData = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                debts: true,
                moneyRequestReceive: true,
            },
        })

        const moneyToUser = await prisma.debt.findMany({
            where: {
                userId: userId,
                isOwedToUser: true,
                isPaid: false,
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        const moneyToOthers = await prisma.debt.findMany({
            where: {
                userId: userId,
                isOwedToUser: false,
                isPaid: false,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        const totalOweToUser = await prisma.debt.aggregate({
            _sum: {
                oweAmount: true,
            },
            where: {
                userId: userId,
                isOwedToUser: true,
                isPaid: false,
            },
        })

        const totalOweToOthers = await prisma.debt.aggregate({
            _sum: {
                oweAmount: true,
            },
            where: {
                userId: userId,
                isOwedToUser: false,
                isPaid: false,
            },
        })

        res.json({
            user: userData,
            totalOweToUser: totalOweToUser._sum.oweAmount,
            totalOweToOthers: totalOweToOthers._sum.oweAmount,
            moneyToUser,
            moneyToOthers,
        })
    } catch (err) {
        next(err)
    }
})

// sign up
userDataRouter.post("/", async (req, res) => {
    console.log("userData post middleware ran")
    const { firstName, lastName, username, password } = req.body
    const foundUsername = await prisma.user.findUnique({
        where: {
            username: username,
        },
    })
    if (foundUsername) {
        return res.status(400).json({ errorMessage: "Username already exists" })
    }

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) return next(err)

        // else, store hashedPassword in DB
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
        res.json({ message: "Successfully added user", user: user })
    })
})

userDataRouter.put("/:userId", verifyToken, async (req, res, next) => {
    try {
        const { userId } = req.params
        const { firstName, lastName } = req.body

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
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
