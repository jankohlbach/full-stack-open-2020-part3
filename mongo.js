const mongoose = require('mongoose');

const password = process.argv[2];
const url = `mongodb+srv://db-user_1:${password}@cluster0.ulqbn.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);


if(process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
