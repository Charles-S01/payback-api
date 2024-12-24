const { Router } = require("express")
const moneyRequestsRouter = Router()
const prisma = require("../prisma/prisma")
const { verifyToken } = require("../verifyToken")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")

moneyRequestsRouter.get("/sent/:userId", verifyToken, async (req, res, next) => {
    try {
        const userId = req.user.id

        const moneyRequestsCreated = await prisma.moneyRequest.findMany({
            where: {
                creatorId: userId,
            },
        })
        res.json({ moneyRequestsCreated })
    } catch (error) {
        next(error)
    }
})

moneyRequestsRouter.get("/received", verifyToken, async (req, res, next) => {
    try {
        // console.log("/received ran")
        const userId = req.user.id

        const requestsReceived = await prisma.moneyRequest.findMany({
            where: {
                receiverId: userId,
            },
            include: {
                creator: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        res.json({ requestsReceived })
    } catch (err) {
        next(err)
    }
})

moneyRequestsRouter.post("/", verifyToken, async (req, res, next) => {
    try {
        // console.log("moneyRequest post ran")
        const { amount, message, receiverId } = req.body

        const moneyRequest = await prisma.moneyRequest.create({
            data: {
                creatorId: req.user.id,
                amount: parseFloat(amount),
                message: message,
                receiverId: receiverId,
            },
        })
        // console.log(moneyRequest)
        res.json({ message: "Successfuly created money request", moneyRequest })
    } catch (err) {
        next(err)
    }
})

module.exports = moneyRequestsRouter
