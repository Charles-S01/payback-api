const path = require("node:path")
require("dotenv").config()
const express = require("express")
const prisma = require("./prisma/prisma")
const routes = require("./routes")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express()

// AUTH SERVER !!

app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// app.use("/log-in", routes.loginRouter)
// app.use("/users", routes.userDataRouter)
app.use("/", routes.authRouter)
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ errorMessage: "Internal Server Error!" })
})

app.listen(4000, () => {
    console.log("Server is runnin' on port 4000 !!")
})
