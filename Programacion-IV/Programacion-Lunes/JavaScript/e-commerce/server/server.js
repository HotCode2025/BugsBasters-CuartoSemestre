 const express = require("express");
 const app = express();
 const cors = require("cors");
 const mercadopago = require("mercadopago");
 const path = require("path");

mercadopago.configure({
    access_token: "APP_USR-4726603056942843-091617-830076df7047b2010c1761010b4341f4-3696428942",
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client/media")));
app.use(cors());

app.get("/", function () {
    path.resolve(__dirname, "..", "client", "media", "index.html");
});

app.post("/create_preference", (req, res) => {
    let preference = {
        items: [
        {
            title: req.body.description,
            unit_price: Number(req.body.price),
            quantity: Number(req.body.quantity),
        },
    ],
    back_urls: {
        success: "http://localhost:5500/feedback",
        failure: "http://localhost:5500/feedback",
        pending: "",
    },
    auto_return: "approved",
    };

    mercadopago.preferences
        .create(preference)
        .then(function (response) {
            res.json({
                id: response.body.id,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.get("/feedback", (req, res) => {
    res.json({
        Payment: req.query.payment_id,
        Status: req.query.status,
        MerchantOrder: req.query.merchant_order_id,
    });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});