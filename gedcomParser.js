var fs = require("fs");
var data = [];
var text = fs.readFileSync("./familyTreeFinal.ged", "utf-8");
data = text.match(/[^\r\n]+/g);
const tags = {
  0: ["INDI", "FAM", "HEAD", "TRLR", "NOTE"],
  1: [
    "NAME",
    "SEX",
    "BIRT",
    "DEAT",
    "FAMC",
    "FAMS",
    "MARR",
    "HUSB",
    "WIFE",
    "CHIL",
    "DIV",
  ],
  2: ["DATE"],
};

var finalData = [];

for (let line = 0; line < data.length; line++) {
  console.log(`--> ${data[line]}`);
  var lineData = data[line].split(" ");

  let level = lineData[0];
  let tag = "";
  if (lineData[2] === "INDI" || lineData[2] === "FAM") {
    tag = lineData[2];
  } else {
    tag = lineData[1];
  }

  var valid = tags[level].includes(tag) ? "Y" : "N";

  if (lineData[2] === "INDI" || lineData[2] === "FAM") {
    if (lineData[3] === "Y" || lineData[3] === "N") {
      lineData[3] = valid;
    } else {
      lineData.splice(3, 0, valid);

      var temp = lineData[1];
      lineData.splice(1, 1);
      lineData.splice(3, 0, temp);
    }
  } else {
    if (lineData[2] === "Y" || lineData[2] === "N") {
      lineData[2] = valid;
    } else {
      lineData.splice(2, 0, valid);
    }
  }

  for (let count = 0; count <= lineData.length; count++) {
    if (count === 2) {
      if (lineData.length === 3) {
        finalData.push(lineData[count]);
        break;
      }
      finalData.push(lineData[count]);
      arguments = lineData.slice(3, lineData.length).join(" ");
      finalData.push(arguments);

      break;
    } else {
      finalData.push(lineData[count]);
    }
  }

  console.log(`<-- ${finalData.join("|")}`);
  finalData = [];
}