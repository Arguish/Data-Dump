const fs = require("fs");
const axios = require("axios").default;

console.log("todo ok");

fs.writeFileSync("./texto.txt", "todo correcto");

const data = fs.readFileSync("./texto.txt", "utf-8");

console.log(data);

const json = axios
  .get("https://jsonplaceholder.typicode.com/todos/1")
  .then((a) => {
    console.log(a.status, a.data);
    return a;
  })
  .then((a) => fs.writeFileSync("./test.json", JSON.stringify(a.data)));
