var jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
    // console.log("verifyToken ran")

    const bearerHeader = req.headers["authorization"]
    if (!bearerHeader) {
        // throw new Error("Could not find bearer header")
        return res.status(404).json({ message: "No bearer header found" })
    }
    const token = bearerHeader.split(" ")[1]
    if (!token) {
        return res.status(404).json({ message: "Could not read token" })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.user = decodedToken
        next()
    })
}

module.exports = { verifyToken }
