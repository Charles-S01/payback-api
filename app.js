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
app.use("/sign-up", routes.signupRouter)
app.use("/owes", routes.owesRouter)

app.listen(3000, () => {
    console.log("Server is runnin' on port 3000 !!")
})
