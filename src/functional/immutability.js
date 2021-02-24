import { Map } from "immutable";
import { produce } from "immer";

// immutable.js
let book = Map({ title: "Harry Potter" });

function publish(book) {
  return book.set("isPublished", true);
}

book = publish(book);

console.log(book.toJS());

// immer.js
let book1 = { title: "Harry Potter" };

function publish1(book) {
  return produce(book, (draftBook) => {
    draftBook.isPublished = true;
  });
}

let newBook = publish1(book1);

console.log(book1);
console.log(newBook);
