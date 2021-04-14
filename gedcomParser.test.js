const { parseGedcom, US01, US11, US12, US25, US27 } = require("./gedcomParser");

test("Testing Base Case", () => {
  expect(parseGedcom("gedcomTestDataBase").noError).toBe(true);
});

test("Testing Base Case", () => {
  expect(parseGedcom("gedcomTestDataBase").noError).toBe(true);
});

test("Test US01", () => {
  expect(US01("gedcomTestData_US01")).toBe(false);
});

test("Test US11", () => {
  expect(US11("gedcomTestData_US11")).toBe(false);
});

test("Test US12", () => {
  expect(US12("gedcomTestData_US12")).toBe(false);
});

test("Test US25", () => {
  expect(US25("")).toBe(false);
});

test("Test US27", () => {
  expect(US27("")).toBe(false);
});
