const { Router } = require("express");
const Nicotine = require("../models/nicotine.model");
const multer = require("multer");
const router = Router();
const path = require("path");
const fs = require("fs");

// Создать папку 'uploads', если она не существует
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const multer = require("multer");
const storage = multer.memoryStorage(); // Используем память
const upload = multer({ storage });

//delete product
router.put("/updateamount", async (req, res) => {
  const { arr } = req.body;
  console.log(arr + "приняло массив");
  try {
    const found = await Nicotine.findOne({
      "product.name": arr.name,
      "product.mark": arr.mark,
      "product.nicotine": arr.nicotine,
    });
    if (found) {
      found.product.forEach((product) => {
        if (
          product.name === arr.name &&
          product.mark === arr.mark &&
          product.nicotine === arr.nicotine
        ) {
          const index = found.product.indexOf(product);
          if (index > -1) {
            found.product.splice(index, 1);
            console.log("нашло и удалило продукт");
          }
        }
      });
      await found.save();
    }
  } catch (e) {
    res.status(500).json({ message: `${e}` });
  }
});

router.put("/changecost", async (req, res) => {
  try {
    const { e } = req.body;
    const type = e.type;
    const name = e.name;
    const cost = e.cost;
    const existingRecord = await Nicotine.findOne({ type });
    if (existingRecord) {
      existingRecord.product.forEach((obj) => {
        if (obj.name === name) {
          obj.cost = cost;
        }
      });
    }
    await existingRecord.save();
  } catch (e) {}
});

router.post("/postProduct", upload.array("gallery"), async (req, res) => {
  try {
    const e = req.body;
    //index where to add

    const place = e.place ? e.place : 0;

    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) throw error;
          return {
            url: result.secure_url,
            contentType: file.mimetype,
          };
        })
        .end(file.buffer)
    );

    const gallery = await Promise.all(uploadPromises);

    const productObj = {
      name: e.name,
      nicotine: e.nicotine,
      cost: e.cost,
      mark: e.mark,
      ammount: e.ammount,
      color: e.color,
      stock: true,
      gallery: gallery,
    };

    // console.log(place + "продукт пришел");
    const type = e.type;
    const existingRecord = await Nicotine.findOne({ type });
    if (place) {
      existingRecord.product.splice(place - 1, 0, productObj);
    } else {
      existingRecord.product.push(productObj);
    }
    await existingRecord.save();
    await console.log("product запушен");
    res.status(200).json({ message: "успешно" });
  } catch (e) {
    console.log(req.body);
    res.status(500).json({ message: `${e}` });
  }
});

router.get("/", async (req, res) => {
  try {
    const nicotine = await Nicotine.find({});
    res.json({ data: nicotine });
    console.log("norm");
  } catch (e) {
    res.status(500).json({ message: "pizdec" });
    console.log("nenorm");
  }
});

let discount = 0;
router.get("/status", (req, res) => {
  try {
    res.json({ discount });
  } catch (e) {
    console.error("Ошибка при разборе JSON:", e);
    res.status(500).json({ error: "Неверный формат JSON" });
  }
});

router.post("/toggle-status", (req, res) => {
  const { arr } = req.body;
  discount = arr;
  console.log("vot sha");
  console.log(arr);
  res.json({ discount });
});

router.get("/:id", async (req, res) => {
  try {
    const nicotine = await Nicotine.findById(req.params.id);
    res.json({ data: nicotine });
  } catch (e) {
    res.status(500).json({ message: "pizdecc" });
  }
});

//stock function

router.put("/stock", async (req, res) => {
  const { arr } = req.body;
  try {
    const found = await Nicotine.findOne({
      "product.name": arr.name,
      "product.mark": arr.mark,
      "product.nicotine": arr.nicotine,
    });
    if (found) {
      found.product.forEach((product) => {
        if (
          product.name === arr.name &&
          product.mark === arr.mark &&
          product.nicotine === arr.nicotine
        ) {
          console.log(product);
          // if (index > -1) {
          //   found.product.splice(index, 1);
          //   console.log("нашло и удалило продукт");
          // }
          console.log(arr.stock);
          product.stock = arr.stock;
        }
      });
      await found.save();
    }
  } catch (e) {
    res.status(500).json({ message: `${e}` });
  }
});

module.exports = router;
