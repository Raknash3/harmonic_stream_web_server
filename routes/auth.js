const router = require('express').Router();

const admin = require("../config/firebase.config");


router.get("/login", async (req, res) => {
    if (!req.header('authorization')) {
        return res.status(500).send({ message: "Invalid token" });
    }

    const token = req.header('authorization').split(" ")[1];
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (!decodeValue) {
            return res.status(500).json({ message: "Unauthorized" });
        } else {
            return res.status(200).json(decodeValue);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }

});

module.exports = router;