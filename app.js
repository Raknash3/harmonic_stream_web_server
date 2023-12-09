const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv/config');

//app.use(cors({ origin: true }));

app.get("/", (req, res) => {
    return res.json("Hello World");
});

// user authentication route
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);


mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true })
    .then(() => {
        console.log("Mongodb Connected");
        mongoose.connection
            .once("open", () => console.log("Connected to MongoDB"))
            .on("error", (error) => {
                console.log(`Error : ${error}`);
            });
    })
    .catch((error) => {
        console.log(`Failed to connect to MongoDB with error: ${error}`);
    });


app.listen(4000, () => console.log("Listening to port 4000"));

