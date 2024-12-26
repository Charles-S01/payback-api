const path = require("node:path")
require("dotenv").config()
const express = require("express")
const prisma = require("./prisma/prisma")
const routes = require("./routes")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express()

app.use(
    cors({
        // origin: ["http://localhost:5173"],
        origin: ["https://payback-app-eight.vercel.app", "http://localhost:5173"],
        credentials: true,
    })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// app.use("/log-in", routes.loginRouter)
// app.use("/sign-up", routes.signupRouter)
app.use("/auth", routes.authRouter)
app.use("/users", routes.userDataRouter)
app.use("/debts", routes.debtRouter)
app.use("/money-request", routes.moneyRequestsRouter)
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ errorMessage: "Internal Server Error" })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is runnin' on port " + PORT)
})
