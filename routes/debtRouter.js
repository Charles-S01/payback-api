const { Router } = require("express")
const debtRouter = Router()
const prisma = require("../prisma/prisma")
const { verifyToken } = require("../verifyToken")

debtRouter.get("/:userId", verifyToken, async (req, res) => {
    const { userId } = req.params

    const debts = await prisma.debt.findMany({
        where: {
            userId: userId,
        },
    })
    // if (!debts) {
    //     return res.status(404).json({errorMessage: 'Did not find debts'})
    // }
    res.json({ debts: debts })
})

debtRouter.post("/:userId", async (req, res) => {
    console.log("debt post ran")
    const { userId } = req.params
    const { otherPartyName, oweAmount, description, isOwedToUser } = req.body

    const debt = await prisma.debt.create({
        data: {
            userId: userId,
            otherPartyName: otherPartyName,
            oweAmount: oweAmount,
            description: description,
            isOwedToUser: isOwedToUser,
        },
    })
    if (!debt) {
        return res.status(400).json({ errorMessage: "Could not create debt" })
    }

    res.json({ debt: debt, message: "Successfuly added debt" })
})

debtRouter.put("/:userId", verifyToken, async (req, res, next) => {
    try {
        const { userId } = req.params
        const { id, otherPartyName, oweAmount, description, isOwedToUser, isPaid } = req.body

        const debt = await prisma.debt.update({
            where: {
                id: id,
            },
            data: {
                otherPartyName: otherPartyName,
                oweAmount: oweAmount,
                description: description,
                isOwedToUser: isOwedToUser,
                isPaid: isPaid,
            },
        })

        res.json({ debt, message: "Successfuly updated debt" })
    } catch (err) {
        next(err)
    }
})

module.exports = debtRouter
