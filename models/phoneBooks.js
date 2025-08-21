require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URL;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connect to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message);
  });

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
    unique: true,
  },
  number: {
    type: String,
    required: [true, "Number is required"],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{5,8}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("PhoneBook", phoneBookSchema);
