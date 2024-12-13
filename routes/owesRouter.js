const { Router } = require("express")
const prisma = require("../prisma/prisma")
const { verifyToken } = require("../verifyToken")
const owesRouter = Router()

owesRouter.get("/", verifyToken, async (req, res) => {
    const userOwes = await prisma.user.findUnique({
        where: {
            id: req.user.id,
        },
        include: {
            owes: true,
            moneyRequestReceive: true,
        },
    })
    if (!userOwes) {
        return res
            .status(403)
            .json({ errorMessage: "Could not retreive user in database" })
    }

    res.json({ userData: userOwes })
})

module.exports = owesRouter
