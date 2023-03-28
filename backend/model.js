const { readFile, writeFile } = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, `orders.json`);

async function fileReader() {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw)
}

async function fileWriter(data) {
    const raw = JSON.stringify(data, null, 2)
    await writeFile(filePath, raw);
}

async function addNewOrder(body) {
    const data = await fileReader()
    console.log(body);
    data.orders.push(body);
    await fileWriter(data)
    return "Add new order"
};

module.exports = {
    addNewOrder,
}