const router = require('express').Router();

const admin = require("../config/firebase.config");
const user = require("../models/user");

router.get("/login", async (req, res) => {
    if (!req.header('authorization')) {
        return res.status(500).send({ message: "Invalid token" });
    }

    const token = req.header('authorization').split(" ")[1];
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (!decodeValue) {
            return res.status(505).json({ message: "Unauthorized" });
        } else {
            // check if user exists in db
            const userExists = await user.findOne({ "user_id": decodeValue.user_id });
            if (!userExists) {

                newUserData(decodeValue, req, res);
            } else {
                updateUserData(decodeValue, req, res)
            }

        }

    } catch (error) {
        return res.status(505).json({ message: error });

    }

});

const newUserData = async (decodeValue, req, res) => {
    const newUser = new user({
        name: decodeValue.name,
        email: decodeValue.email,
        imageURL: decodeValue.picture,
        user_id: decodeValue.user_id,
        email_verfied: decodeValue.email_verified,
        role: "member",
        auth_time: decodeValue.auth_time,
    })

    try {
        const savedUser = await newUser.save();
        res.status(200).send({ user: savedUser });
    } catch (error) {
        res.status(400).send({ success: false, msg: error });
    }
};

const updateUserData = async (decodeValue, req, res) => {
    const filter = { user_id: decodeValue.user_id };
    const options = {
        upsert: true,
        new: true,
    };

    try {
        const result = await user.findOneAndUpdate(
            filter,
            { auth_time: decodeValue.auth_time },
            options
        );
        res.status(200).send({ user: result });
    } catch (err) {
        res.status(400).send({ success: false, msg: err });
    }
};

module.exports = router;
