const fs = require(`fs`);
const express = require(`express`);
const inquirer = require(`inquirer`);
const prompts = require(`./routes/inquiries`);
const { QueryManager } = require("./routes/connection");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function main() {
  const QM = new QueryManager(app,PORT);
}

main()