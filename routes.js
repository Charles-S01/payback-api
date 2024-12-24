const loginRouter = require("./routes/logInRouter")
const userDataRouter = require("./routes/userDataRouter")
const signupRouter = require("./routes/signupRouter")
const debtRouter = require("./routes/debtRouter")
const moneyRequestsRouter = require("./routes/moneyRequests")
const authRouter = require("./routes/authRouter")

const routes = { loginRouter, signupRouter, userDataRouter, debtRouter, moneyRequestsRouter, authRouter }

module.exports = routes
