const person = {
  name: "John",
  address: {
    country: "NGA",
    city: "Ikorodu",
  },
};

// Using Object.assign
const newObj = Object.assign({}, person, { name: "Bob" });

// Using spread operator
const updated = { ...person, address: { ...person.address }, name: "Bob" };
updated.address.city = "ENG";
console.log(person);
