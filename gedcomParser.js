var gedcomFileName = "gedcomTestDataBase";

function parseGedcom(fileName) {
  var fs = require("fs");
  var data = [];
  var text = fs.readFileSync(`./${fileName}.ged`, "utf-8");
  data = text.match(/[^\r\n]+/g);
  noError = true;

  //Individual Table
  var individualData = [];
  var individualDetails = {
    ID: "",
    Name: "",
    Gender: "",
    Birthday: "",
    Age: Number,
    Alive: true,
    Death: "NA",
    Child: "NA",
    Spouse: "NA",
  };

  for (let line = 0; line < data.length; line++) {
    var lineData = data[line].split(" ");

    if (lineData[2] === "INDI") {
      individualDetails.ID = lineData[1].replace(/[@]/g, "");

      for (let counter = line + 1; counter < data.length; counter++) {
        var nameLineData = data[counter].split(" ");

        if (nameLineData[1] === "NAME") {
          individualDetails.Name = nameLineData
            .slice(2, nameLineData.length)
            .join(" ");
        } else if (nameLineData[1] === "SEX") {
          individualDetails.Gender = nameLineData[2];
        } else if (nameLineData[1] === "BIRT") {
          individualDetails.Birthday = data[counter + 1]
            .split(" ")
            .slice(2, data[counter + 1].length)
            .join(" ");
        } else if (nameLineData[1] === "DEAT") {
          individualDetails.Alive = false;
          individualDetails.Death = data[counter + 1]
            .split(" ")
            .slice(2, data[counter + 1].length)
            .join(" ");
        } else if (nameLineData[1] === "FAMC") {
          individualDetails.Child = nameLineData[2].replace(/[@]/g, "");
        } else if (nameLineData[1] === "FAMS") {
          individualDetails.Spouse = nameLineData[2].replace(/[@]/g, "");
        } else if (nameLineData[2] === "INDI") {
          break;
        }
      }

      var birth = new Date(Date.parse(individualDetails.Birthday));
      if (individualDetails.Alive === true) {
        var today = new Date();
      } else {
        var today = new Date(Date.parse(individualDetails.Death));
      }
      var ageTime = today.getTime() - birth.getTime();
      var ageYears = Math.floor(ageTime / (1000 * 60 * 60 * 24) / 365);

      individualDetails.Age = ageYears;

      individualData.push(individualDetails);
      var individualDetails = {
        ID: "",
        Name: "",
        Gender: "",
        Birthday: "",
        Age: Number,
        Alive: true,
        Death: "NA",
        Child: "NA",
        Spouse: "NA",
      };
    }
  }

  //Family Table
  var familyData = [];
  var familyDetails = {
    ID: "",
    Married: "",
    Divorced: "NA",
    HusbandId: "",
    HusbandName: "",
    WifeId: "",
    WifeName: "",
    Children: [],
  };

  for (let line = 0; line < data.length; line++) {
    var lineData = data[line].split(" ");

    if (lineData[2] === "FAM") {
      familyDetails.ID = lineData[1].replace(/[@]/g, "");

      for (let counter = line + 1; counter < data.length; counter++) {
        var familyLineData = data[counter].split(" ");

        if (familyLineData[1] === "MARR") {
          familyDetails.Married = data[counter + 1]
            .split(" ")
            .slice(2, data[counter + 1].length)
            .join(" ");
        } else if (familyLineData[1] === "HUSB") {
          familyDetails.HusbandId = familyLineData[2].replace(/[@]/g, "");
          for (let indiData = 0; indiData < individualData.length; indiData++) {
            if (individualData[indiData].ID === familyDetails.HusbandId) {
              husbandBirthDate = individualData[indiData].Birthday;
              break;
            }
          }
        } else if (familyLineData[1] === "WIFE") {
          familyDetails.WifeId = familyLineData[2].replace(/[@]/g, "");
          for (let indiData = 0; indiData < individualData.length; indiData++) {
            if (individualData[indiData].ID === familyDetails.WifeId) {
              wifeBirthDate = individualData[indiData].Birthday;
              break;
            }
          }
        } else if (familyLineData[1] === "CHIL") {
          familyDetails.Children.push(familyLineData[2].replace(/[@]/g, ""));
        } else if (familyLineData[1] === "DIV") {
          familyDetails.Divorced = data[counter + 1]
            .split(" ")
            .slice(2, data[counter + 1].length)
            .join(" ");
        } else if (familyLineData[2] === "FAM") {
          break;
        }
      }

      for (let indiData = 0; indiData < individualData.length; indiData++) {
        if (individualData[indiData].ID === familyDetails.HusbandId) {
          familyDetails.HusbandName = individualData[indiData].Name;
        }
        if (individualData[indiData].ID === familyDetails.WifeId) {
          familyDetails.WifeName = individualData[indiData].Name;
        }
      }

      familyData.push(familyDetails);
      var familyDetails = {
        ID: "",
        Married: "",
        Divorced: "NA",
        HusbandId: "",
        HusbandName: "",
        WifeId: "",
        WifeName: "",
        Children: [],
      };
    }
  }

  return { individualData, familyData, noError };
}
parseGedcom(gedcomFileName);

//Errors Array to store all error in gedcom file
var errors = [];

//Function to compare two dates
function dateChecker(date1, date2 = new Date()) {
  var date1 = new Date(Date.parse(date1));
  var date2 = new Date(Date.parse(date2));
  var ageTime = date2.getTime() - date1.getTime();

  if (ageTime < 0) {
    return false; //date2 is before date1
  } else {
    return true;
  }
}

//Age Calculator Function
function calculateAge(dob, dod) {
  //dob- date of birth, dod- date of death
  let birthDay, current, millisec_difference, deathDay;

  birthDay = new Date(Date.parse(dob));
  deathDay = new Date(Date.parse(dod));
  //console.log(deathDay);

  current = new Date();

  if (!dod) {
    millisec_difference = Math.abs(current.getTime() - birthDay.getTime());
  } else {
    millisec_difference = Math.abs(deathDay.getTime() - birthDay.getTime());
  }

  let age = millisec_difference / (1000 * 3600 * 24 * 365);

  return age;
}

var data = parseGedcom(gedcomFileName);
var individualData = data.individualData;
var familyData = data.familyData;
console.log("People");
console.table(individualData);
console.log("Families");
console.table(familyData);

// Printing errors in GEDCOM file
for (error in errors) {
  console.log(errors[error]);
}

module.exports = {
  parseGedcom,
};
