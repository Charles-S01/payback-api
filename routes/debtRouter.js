const { Router } = require("express")
const debtRouter = Router()
const prisma = require("../prisma/prisma")
const { verifyToken } = require("../verifyToken")

debtRouter.get("/search/:userId", async (req, res, next) => {
    console.log("/debts/search ran")
    try {
        const { userId } = req.params
        const { isPaid, isOwedToUser } = req.query

        const debts = await prisma.debt.findMany({
            where: {
                // ...(userId && { userId: userId }),
                userId: userId,
                ...(isOwedToUser && { isOwedToUser: isOwedToUser === "true" }),
                ...(isPaid && { isPaid: isPaid === "true" }),
            },
            orderBy: {
                createdAt: "desc",
            },
            // take: 10,
        })
        res.json({ debts })
    } catch (err) {
        next(err)
    }
})

debtRouter.get("/single/:debtId", verifyToken, async (req, res, next) => {
    try {
        console.log("get debts/:debtId")
        const { debtId } = req.params
        const userId = req.user.id

        const debt = await prisma.debt.findUnique({
            where: {
                id: parseInt(debtId),
                userId: req.user.id,
            },
        })
        // if (debt.userId !== userId) {
        //     return res.status(401).json({ errorMessage: "Unauthorized" })
        // }
        res.json({ debt })
    } catch (err) {
        next(err)
    }
})

debtRouter.get("/totalDebt", verifyToken, async (req, res, next) => {
    console.log("/debts/totalDebt ran")
    try {
        const userId = req.user.id

        const owesToUser = await prisma.debt.aggregate({
            _sum: {
                oweAmount: true,
            },
            where: {
                userId: userId,
                isOwedToUser: true,
                isPaid: false,
            },
        })
        const totalOweToUser = owesToUser._sum.oweAmount

        const owesToOthers = await prisma.debt.aggregate({
            _sum: {
                oweAmount: true,
            },
            where: {
                userId: userId,
                isOwedToUser: false,
                isPaid: false,
            },
        })
        const totalOweToOthers = owesToOthers._sum.oweAmount

        res.json({ totalOweToUser, totalOweToOthers })
    } catch (err) {
        next(err)
    }
})

debtRouter.post("/", verifyToken, async (req, res, next) => {
    try {
        console.log("DEBT POST ran")
        // const { userId } = req.params
        const { otherPartyName, oweAmount, description, isOwedToUser } = req.body

        const debt = await prisma.debt.create({
            data: {
                userId: req.user.id,
                otherPartyName: otherPartyName,
                oweAmount: parseFloat(oweAmount),
                description: description,
                isOwedToUser: isOwedToUser,
            },
        })

        res.json({ debt: debt, message: "Successfuly added debt" })
    } catch (err) {
        next(err)
    }
})

debtRouter.put("/:debtId", verifyToken, async (req, res, next) => {
    console.log("debt put ran")
    try {
        const { debtId } = req.params
        const { otherPartyName, oweAmount, description, isOwedToUser, isPaid } = req.body

        const debt = await prisma.debt.update({
            where: {
                id: parseInt(debtId),
                userId: req.user.id,
            },
            data: {
                otherPartyName: otherPartyName,
                oweAmount: parseFloat(oweAmount),
                description: description,
                // isOwedToUser: isOwedToUser,
                isPaid: isPaid,
            },
        })

        res.json({ debt, message: "Successfuly updated debt" })
    } catch (err) {
        next(err)
    }
})

debtRouter.delete("/:debtId?", verifyToken, async (req, res, next) => {
    try {
        console.log("debts delete ran")
        const { debtId } = req.params
        const { isPaid } = req.query

        const debts = await prisma.debt.deleteMany({
            where: {
                userId: req.user.id,
                ...(debtId && { id: parseInt(debtId) }),
                ...(isPaid && { isPaid: isPaid === "true" }),
            },
        })
        res.json({ debts })
    } catch (error) {
        next(err)
    }
})

module.exports = debtRouter
