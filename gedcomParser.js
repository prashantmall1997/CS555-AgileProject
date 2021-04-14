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

//US01 - Dates before current date
function US01(fileName) {
  var data = parseGedcom(fileName);
  var individualData = data.individualData;
  var familyData = data.familyData;
  var noError = true;

  for (
    indiDataElement = 0;
    indiDataElement < individualData.length;
    indiDataElement++
  ) {
    if (!dateChecker(individualData[indiDataElement].Birthday)) {
      errors.push(
        `ERROR: INDIVIDUAL: US01: ${individualData[indiDataElement].ID}: Birthday ${individualData[indiDataElement].Birthday} occurs in the future.`
      );
      noError = false;
    }
    if (individualData[indiDataElement].Death != "NA") {
      if (!dateChecker(individualData[indiDataElement].Death)) {
        errors.push(
          `ERROR: INDIVIDUAL: US01: ${individualData[indiDataElement].ID}: Death ${individualData[indiDataElement].Death} occurs in the future.`
        );
        noError = false;
      }
    }
  }

  for (
    familyDataElement = 0;
    familyDataElement < familyData.length;
    familyDataElement++
  ) {
    if (!dateChecker(familyData[familyDataElement].Married)) {
      errors.push(
        `ERROR: INDIVIDUAL: US01: ${familyData[familyDataElement].ID}: Marriage ${familyData[familyDataElement].Married} occurs in the future.`
      );
      noError = false;
    }
    if (familyData[familyDataElement].Divorced != "NA") {
      if (!dateChecker(familyData[familyDataElement].Divorced)) {
        errors.push(
          `ERROR: FAMILY: US01: ${familyData[familyDataElement].ID}: Divorce ${familyData[familyDataElement].Divorced} occurs in the future.`
        );
        noError = false;
      }
    }
  }

  return noError;
}
US01(gedcomFileName);

//US11 Marriage should not occur during marriage to another spouse
function US11(fileName) {
  var data = parseGedcom(fileName);
  var individualData = data.individualData;
  var familyData = data.familyData;
  var noError = true;

  for (let line = 0; line < data.length; line++) {
    var lineData = data[line].split(" ");

    if (lineData[2] === "FAM") {
      for (let counter = line + 1; counter < data.length; counter++) {
        var familyLineData = data[counter].split(" ");

        if (familyLineData[1] === "MARR") {
          marriageDate = data[counter + 1]
            .split(" ")
            .slice(2, data[counter + 1].length)
            .join(" ");

          for (
            let marriageCounter = counter + 1;
            marriageCounter < data.length;
            marriageCounter++
          ) {
            var familyLineData = data[marriageCounter].split(" ");

            if (familyLineData[1] === "MARR") {
              compareMarriageDate = data[marriageCounter + 1]
                .split(" ")
                .slice(2, data[marriageCounter + 1].length)
                .join(" ");

              if (marriageDate === compareMarriageDate) {
                var famOneIncrement;
                var famTwoIncrement;
                if (data[counter + 2].split(" ")[1] === "HUSB") {
                  famOneIncrement = 2;
                } else {
                  famOneIncrement = 4;
                }
                if (data[marriageCounter + 2].split(" ")[1] === "HUSB") {
                  famTwoIncrement = 2;
                } else {
                  famTwoIncrement = 4;
                }

                if (
                  data[counter + famOneIncrement].split(" ")[2] ===
                  data[marriageCounter + famTwoIncrement].split(" ")[2]
                ) {
                  errors.push(
                    `ANAMOLY: FAMILY: US11: ${data[marriageCounter - 1]
                      .split(" ")[1]
                      .replace(/[@]/g, "")}: Marriage of Husband ${data[
                      marriageCounter + famTwoIncrement
                    ]
                      .split(" ")[2]
                      .replace(
                        /[@]/g,
                        ""
                      )} occurs with both the spouse on same day.`
                  );
                  counter = marriageCounter;
                  noError = false;
                  break;
                }
                if (
                  data[counter + famOneIncrement + 1].split(" ")[2] ===
                  data[marriageCounter + famTwoIncrement + 1].split(" ")[2]
                ) {
                  errors.push(
                    `ANAMOLY: FAMILY: US11: ${data[marriageCounter - 1]
                      .split(" ")[1]
                      .replace(/[@]/g, "")}: Marriage of Wife ${data[
                      marriageCounter + famTwoIncrement + 1
                    ]
                      .split(" ")[2]
                      .replace(
                        /[@]/g,
                        ""
                      )} occurs with both the spouse on same day.`
                  );
                  counter = marriageCounter;
                  noError = false;
                  break;
                }
              }
            }
          }
        }
      }
    }
  }
  return noError;
}
US11(gedcomFileName);

//US12 Mother should be less than 60 years older than her children and father should be less than 80 years older than his children
function US12(fileName) {
  var data = parseGedcom(fileName);
  var individualData = data.individualData;
  var familyData = data.familyData;
  var noError = true;

  for (let line = 0; line < data.length; line++) {
    var lineData = data[line].split(" ");
    if (lineData[1] === "HUSB") {
      var husband = lineData[2];
      var wife = data[line + 1].split(" ")[2];
      for (let counter = line + 1; counter < data.length; counter++) {
        var familyLineData = data[counter].split(" ");
        if (familyLineData[2] === "FAM") {
          break;
        }

        for (let lineLoop = 0; lineLoop < data.length; lineLoop++) {
          var lineData = data[lineLoop].split(" ");

          if (lineData[1] === husband) {
            for (
              let counterLoop = lineLoop + 1;
              counterLoop < data.length;
              counterLoop++
            ) {
              var nameLineData = data[counterLoop].split(" ");

              if (nameLineData[1] === "BIRT") {
                husbandBirthday = data[counterLoop + 1]
                  .split(" ")
                  .slice(2, data[counterLoop + 1].length)
                  .join(" ");
                break;
              }
            }
          }
        }

        for (let lineLoop = 0; lineLoop < data.length; lineLoop++) {
          var lineData = data[lineLoop].split(" ");

          if (lineData[1] === wife) {
            for (
              let counterLoop = lineLoop + 1;
              counterLoop < data.length;
              counterLoop++
            ) {
              var nameLineData = data[counterLoop].split(" ");

              if (nameLineData[1] === "BIRT") {
                wifeBirthday = data[counterLoop + 1]
                  .split(" ")
                  .slice(2, data[counterLoop + 1].length)
                  .join(" ");
                break;
              }
            }
          }
        }

        if (familyLineData[1] === "CHIL") {
          var child = familyLineData[2];

          for (let lineLoop = 0; lineLoop < data.length; lineLoop++) {
            var lineData = data[lineLoop].split(" ");

            if (lineData[1] === child) {
              for (
                let counterLoop = lineLoop + 1;
                counterLoop < data.length;
                counterLoop++
              ) {
                var nameLineData = data[counterLoop].split(" ");

                if (nameLineData[1] === "BIRT") {
                  childBirthday = data[counterLoop + 1]
                    .split(" ")
                    .slice(2, data[counterLoop + 1].length)
                    .join(" ");
                  break;
                }
              }
            }
          }

          var childDate = new Date(Date.parse(childBirthday));
          var husbandDate = new Date(Date.parse(husbandBirthday));
          var wifeDate = new Date(Date.parse(wifeBirthday));

          var currDate = new Date();

          var childAge = Math.floor(
            (currDate.getTime() - childDate.getTime()) / 31557600000
          );
          var husbandAge = Math.floor(
            (currDate.getTime() - husbandDate.getTime()) / 31557600000
          );
          var wifeAge = Math.floor(
            (currDate.getTime() - wifeDate.getTime()) / 31557600000
          );

          var famOneIncrement;
          if (data[line - 3].split(" ")[2] === "FAM") {
            famOneIncrement = 3;
          } else {
            famOneIncrement = 5;
          }

          if (wifeAge - childAge >= 60) {
            errors.push(
              `ERROR: FAMILY: US12: ${data[line - famOneIncrement]
                .split(" ")[1]
                .replace(/[@]/g, "")}: Age of Mother ${wife.replace(
                /[@]/g,
                ""
              )} should be less than 60 years older than her children.`
            );
            noError = false;
          }

          if (husbandAge - childAge >= 80) {
            errors.push(
              `ERROR: FAMILY: US12: ${data[line - famOneIncrement]
                .split(" ")[1]
                .replace(/[@]/g, "")}: Age of Father ${husband.replace(
                /[@]/g,
                ""
              )} should be less than 80 years older than his children.`
            );
            noError = false;
          }

          // console.log(
          //   `Child ${child} age: ${childAge} of Father ${husband} Age: ${husbandAge} & Mother ${wife} Age: ${wifeAge}`
          // );
        }
      }
    }
  }
  return noError;
}
US12(gedcomFileName);

//US25 Unique first names in families
function US25(fileName) {
  var data = parseGedcom(fileName);
  var individualData = data.individualData;
  var familyData = data.familyData;
  var noError = true;

  for (var family = 0; family < familyData.length; family++) {
    const childrenData = [];
    for (
      var children = 0;
      children < familyData[family].Children.length;
      children++
    ) {
      const child = familyData[family].Children[children];

      for (var people = 0; people < individualData.length; people++) {
        if (child === individualData[people].ID) {
          var childDOB = individualData[people].Birthday;
          var childName = individualData[people].Name;
          break;
        }
      }
      childrenData.push({
        ID: child,
        FID: familyData[family].ID,
        Name: childName,
        Birthday: childDOB,
      });
    }
    for (var loop = 0; loop < childrenData.length; loop++) {
      for (
        var innerLoop = loop + 1;
        innerLoop < childrenData.length;
        innerLoop++
      ) {
        if (
          childrenData[loop].Name === childrenData[innerLoop].Name &&
          childrenData[loop].Birthday === childrenData[innerLoop].Birthday
        ) {
          errors.push(
            `ERROR: FAMILY: US25: Name and DOB of ${childrenData[loop].ID} & ${childrenData[innerLoop].ID} are same in family ${childrenData[innerLoop].FID}`
          );
          noError = false;
        }
      }
    }
  }
  return noError;
}
US25(gedcomFileName);

//US27 Include individual ages
function US27(fileName) {
  var data = parseGedcom(fileName);
  var individualData = data.individualData;
  var familyData = data.familyData;
  var noError = true;

  for (var people = 0; people < individualData.length; people++) {
    if (isNaN(individualData[people].Age)) {
      errors.push(
        `ERROR: ERROR: US27: Age of ${individualData[people].ID} is not included`
      );
      noError = false;
    }
  }
  return noError;
}
US27(gedcomFileName);

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
  US01,
  US11,
  US12,
  US25,
  US27,
};
