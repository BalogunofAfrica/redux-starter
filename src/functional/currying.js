function add(a) {
  return function (b) {
    return a + b;
  };
}

add(1)(5); // Adds 1 and 5

const add2 = (a) => (b) => a + b; // This is the same as (a, b) => a + b
