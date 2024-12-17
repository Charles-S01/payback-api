const path = require("node:path")
require("dotenv").config()
const express = require("express")
const prisma = require("./prisma/prisma")
const routes = require("./routes")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/log-in", routes.loginRouter)
// app.use("/sign-up", routes.signupRouter)
app.use("/userData", routes.userDataRouter)
app.use("/debts", routes.debtRouter)
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ errorMessage: "Internal Server Error" })
})

app.listen(3000, () => {
    console.log("Server is runnin' on port 3000 !!")
})
