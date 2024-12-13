var jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"]
    const token = bearerHeader.split(" ")[1]
    if (!token) {
        return res.status(404).json({ errorMessage: "Could not read token" })
    }

    jwt.verify(token, "secretKey", (err, decodedToken) => {
        if (err) {
            return res
                .status(403)
                .json({ errorMessage: "Token verification failed" })
        }
        req.user = decodedToken
        next()
    })
}

module.exports = { verifyToken }
