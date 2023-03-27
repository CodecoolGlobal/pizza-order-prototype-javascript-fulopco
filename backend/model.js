const { readFile, writeFile } = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, `beers.json`);

async function fileReader(path) {
  return await readFile(path, "utf8");
}

async function fileWriter(path) {
  return await writeFile(path, "utf8");
}

// itt kezeljük a requesteket
