const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.mySecret);
        req.user = decoded.user;
        next();

    } catch (err) {
        console.log(err);
        res.status(401).json({ msg: "Token is not valid" });
    }
};