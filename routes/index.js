var express = require("express");
var router = express.Router();
const uuidv4 = require("uuid/v4");
const puppeteer = require("puppeteer");
var mockdata = require("./mockdata");
var dummy = require("./mockGridState");
var mockColumn = require("./mockColumn");
var mockGridState = require("./mockGridState");
var reqMock = require("./req");

const data = {};
var column = [];
var gridState;

/* GET home page. */
router.get("/exportdata", function(req, res, next) {
  const id = req.query.id;
  // for testing purposes
  // const resData = id ? data : mockdata;
  res.render("index", {
    // data: JSON.stringify(resData.data),
    // column: JSON.stringify(resData.column),

    // For Real
    column: JSON.stringify(column),
    data: JSON.stringify(data[id]),
    gridState: JSON.stringify(gridState)

    // For Local - To display grid on node server html page for local designing purpose
    // data: JSON.stringify(mockdata),
    // column: JSON.stringify(mockColumn),
    // gridState: JSON.stringify(mockGridState)
  });
});
// const timeout = ms => new Promise(res => setTimeout(res, ms));
// method accepts data and filters and sorting
router.post("/generate-pdf", async (request, res, next) => {
  console.log("generate pdf: ");

  const id = uuidv4();
  const req = request;
  console.log('req: ', request);
  // const req = JSON.parse(reqMock);
  data[id] = req.body.data;
  column = req.body.column;
  gridState = req.body.state;

  // For Local - To display grid on node server html page for local designing purpose
  // data = mockdata;
  // column = mockColumn;
  // gridState = mockGridState;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:3000/exportdata?id=${id}`, {
    waitUntil: "networkidle0"
  });

  await page.pdf({ path: __dirname + "/../public/page.pdf", format: "A4" });

  await browser.close();
  delete data[id];
  delete column;

  var options = {
    root: __dirname + "/../public/",
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept"
    }
  };
  res.sendFile("page.pdf", options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", "page.pdf");
    }
  });
});

module.exports = router;

async function download() {
  const response = await fetch("http://localhost:3000/generate-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data: [
        {
          ContactName: "ContactName 1",
          ContactTitle: "ContactTitle 1",
          CompanyName: "CompanyName 1",
          Country: "Country 1"
        }
      ],
      column: [
        {
          field: "ContactName",
          title: "ContactName",
          width: 240
        },
        {
          field: "ContactTitle",
          title: "ContactTitle"
        },
        {
          field: "CompanyName",
          title: "CompanyName"
        },
        {
          field: "Country",
          title: "Country",
          width: 150
        }
      ]
    })
  });
  const file = await response.blob();
  var fileURL = URL.createObjectURL(file);
  window.open(fileURL);
}
