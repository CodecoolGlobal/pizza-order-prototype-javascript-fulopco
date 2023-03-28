const { readFile, writeFile } = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, `orders.json`);

// async function fileReader(path) {
//   return await readFile(path, "utf8");
// }

// async function fileWriter(path) {
//   return await writeFile(path, "utf8");
// }

// itt kezeljük a requesteket
async function addNewOrder(body){
const data = readFile(filePath);
data.orders.push(body);
writeFile(data);
};



module.exports = addNewOrder;