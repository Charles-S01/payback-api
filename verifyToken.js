var jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
    console.log("verifyToken ran")

    const bearerHeader = req.headers["authorization"]
    if (!bearerHeader) {
        // throw new Error("Could not find bearer header")
        return res.status(404).json({ errorMessage: "No bearer header found" })
    }
    const token = bearerHeader.split(" ")[1]
    if (!token) {
        return res.status(404).json({ errorMessage: "Could not read token" })
    }

    jwt.verify(token, "secretKey", (err, decodedToken) => {
        if (err) {
            return next(err)
        }
        req.user = decodedToken
        next()
    })
}

module.exports = { verifyToken }
