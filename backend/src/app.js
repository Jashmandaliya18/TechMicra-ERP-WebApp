const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.status(200).json({
        message: "TechMicra ERP API is running 🚀",
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

module.exports = app;