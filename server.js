const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("server"));
app.use("/images", express.static("images"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
})

mongoose
    .connect("mongodb+srv://donovankeshawn:donovan@cluster0.cygbdth.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("connected to mongodb"))
    .catch((error) => console.log("couldn't connect to mongodb", error));


const upload = multer({ storage: storage});

app.get("/", (req, res) => {rs

    res.sendFile(__dirname + "/index.html");
})

let products = [
    {
        id: 1,
        "a": "../page6/index.html",
        "img": "images/iphone.jpg",
        "name": "iPhone 15",
        "description": "The latest iPhone created by apple featuring a new titanium design, USB-C charging and the dynamic island."
    },
    {
        id: 2,
        "a": "#",
        "img": "images/samsung.jpg",
        "name": "Samsung Galaxy S23",
        "description": "The latest Samsung Galaxy by Samsung featuring a snapdragon processor, good battery life, and an uprgraded camera."
    },
    {
        id: 3,
        "a": "#",
        "img": "images/pixel.jpg",
        "name": "Google Pixel 8",
        "description": "The latest Google Pixel designed by Google features an uprgraded camera, a temperature sensor, and a polished metal finish."
    },

]

app.get("/api/products", (req, res) => {
    res.send(products);
});

app.get("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
  
    const product = products.find((r)=>r.id === id);

    if (!product) {
        res.status(404).send("The product with the given id was not found");
    }

    res.send(product);
});

app.post("/api/products", upload.single("img"), (req,res) => {
    const result = validateProduct(req.body);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const product = {
        _id: products.length + 1,
        name: req.body.name,
        description: req.body.description,
    };

    // if (req.body.parts) {
    //     instrument.parts = req.body.parts.split(",");
    // }

    if (req.file) {
        product.img = "images/" + req.file.filename;
    }

    products.push(product);
    res.send(product);
});

app.put("/api/products/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);
  
    const product = products.find((r)=>r.id === id);

    const result = validateProduct(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    product.a = req.body.a;
    product.name = req.body.name;
    product.description = req.body.description;

     if (req.file) {
        product.img = "images/" + req.file.filename;
    }

    res.send(product);
});

app.delete("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
  
    const product = products.find((r)=>r.id === id);

    if (!product) {
        res.status(404).send("The product with the given id was not found");
    }

    const index = products.indexOf(product);
    products.splice(index, 1);
    res.send(product);
});

const validateProduct = (product) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required(),
        img: Joi.optional(),
    });

    return schema.validate(product);
};

app.listen(3000, () => {
    console.log("I'm listening");
});