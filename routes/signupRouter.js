const { Router } = require("express")
const prisma = require("../prisma/prisma")
const signupRouter = Router()
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")

signupRouter.post("/", async (req, res) => {
    console.log("sign up middleware ran")
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

module.exports = signupRouter
