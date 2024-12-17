const loginRouter = require("./routes/logInRouter")
const userDataRouter = require("./routes/userDataRouter")
const signupRouter = require("./routes/signupRouter")
const debtRouter = require("./routes/debtRouter")

const routes = { loginRouter, signupRouter, userDataRouter, debtRouter }

module.exports = routes
