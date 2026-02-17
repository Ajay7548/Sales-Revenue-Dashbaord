const XLSX = require("xlsx");
const path = require("path");

const filePath = path.join(__dirname, "../Assignment_-_2_Dataset.xlsx");
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log("Headers:", JSON.stringify(data[0]));
console.log("First Row:", JSON.stringify(data[1]));
