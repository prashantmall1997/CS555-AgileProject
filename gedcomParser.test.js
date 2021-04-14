const {
  parseGedcom,
  US01,
  US03,
  US04,
  US11,
  US12,
  US13,
  US14,
  US25,
  US27,
  US35,
  US36,
} = require("./gedcomParser");

test("Testing Base Case", () => {
  expect(parseGedcom("gedcomTestDataBase").noError).toBe(true);
});

test("Testing Base Case", () => {
  expect(parseGedcom("gedcomTestDataBase").noError).toBe(true);
});

test("Test US01", () => {
  expect(US01("gedcomTestData_US01")).toBe(false);
});

test("Test US03", () => {
  expect(US03("gedcomTestData_US03")).toBe(false);
});

test("Test US04", () => {
  expect(US04("gedcomTestData_US04")).toBe(false);
});

test("Test US11", () => {
  expect(US11("gedcomTestData_US11")).toBe(false);
});

test("Test US12", () => {
  expect(US12("gedcomTestData_US12")).toBe(false);
});

test("Test US13", () => {
  expect(US13("gedcomTestData_US13")).toBe(false);
});

test("Test US14", () => {
  expect(US14("")).toBe(false);
});

test("Test US25", () => {
  expect(US25("")).toBe(false);
});

test("Test US27", () => {
  expect(US27("")).toBe(false);
});

test("Test US35", () => {
  expect(US35("")).toBe(false);
});

test("Test US36", () => {
  expect(US36("")).toBe(false);
});
