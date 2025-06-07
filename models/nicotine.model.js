const { Schema, model } = require("mongoose");
const schema = new Schema(
  {
    type: String,
    firstFilter: String,
    secondFilter: String,
    thirdFilter: String,
    product: [
      {
        name: String,
        nicotine: String,
        // ammount: Number,
        mark: String,
        cost: Number,
        color: String,
        stock: Boolean,
        gallery: [
          {
            url: String,
            contentType: String,
          },
        ],
      },
    ],
  },
  {
    collection: "nicotine",
    versionKey: false,
  }
);
module.exports = model("nicotine", schema);
