const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://xTrujix:${password}@cluster0.sdaesqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url)
 

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phonebook = mongoose.model("PhoneBook", phoneBookSchema);

const phoneBook = new Phonebook({ name, number });

if (name !== undefined && number !== undefined) {
  phoneBook
    .save()
    .then(() => {
      console.log(`--------------------------`);
      console.log(`${name} saved`);
      console.log(`--------------------------`);
      return Phonebook.find({});
    })
    .then((result) => {
      console.log("phonebook: ");

      result.forEach((contact) => console.log(contact.name, contact.number));
      mongoose.connection.close();
    });
} else {
  Phonebook.find({}).then((result) => {
    console.log("phonebook: ");
    result.forEach((contact) => {
      console.log(contact.name, contact.number);
    });
    mongoose.connection.close();
  });
}
