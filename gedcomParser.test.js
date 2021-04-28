const {
  US01,
  US03,
  US04,
  US05,
  US06,
  US07,
  US08,
  US09,
  US10,
  US11,
  US12,
  US13,
  US14,
  US15,
  US16,
  US21,
  US22,
  US23,
  US24,
  US25,
  US27,
  US28,
  US29,
  US35,
  US36,
} = require("./gedcomParser");

test("Test US01", () => {
  expect(US01("gedcomTestData_US01")).toBe(false);
});

test("Test US02", () => {
  expect(US02("gedcomTestData_US02")).toBe(false);
});

test("Test US03", () => {
  expect(US03("gedcomTestData_US03")).toBe(false);
});

test("Test US04", () => {
  expect(US04("gedcomTestData_US04")).toBe(false);
});

test("Test US05", () => {
  expect(US05("gedcomTestData_US05")).toBe(false);
});

test("Test US06", () => {
  expect(US06("gedcomTestData_US06")).toBe(false);
});

test("Test US07", () => {
  expect(US07("gedcomTestData_US07")).toBe(false);
});

test("Test US08", () => {
  expect(US08("gedcomTestData_US08")).toBe(false);
});

test("Test US09", () => {
  expect(US09("gedcomTestData_US09")).toBe(false);
});

test("Test US10", () => {
  expect(US10("gedcomTestData_US10")).toBe(false);
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
  expect(US14("gedcomTestData_US14")).toBe(false);
});

test("Test US15", () => {
  expect(US15("gedcomTestData_US15")).toBe(false);
});

test("Test US16", () => {
  expect(US16("gedcomTestData_US16")).toBe(false);
});

test("Test US21", () => {
  expect(US21("gedcomTestData_US21")).toBe(false);
});

test("Test US22", () => {
  expect(US22("gedcomTestData_US22")).toBe(false);
});

test("Test US23", () => {
  expect(US23("gedcomTestData_US23")).toBe(false);
});

test("Test US24", () => {
  expect(US24("gedcomTestData_US24")).toBe(false);
});

test("Test US25", () => {
  expect(US25("gedcomTestData_US25")).toBe(false);
});

test("Test US27", () => {
  expect(US27("gedcomTestData_US27")).toBe(false);
});

test("Test US35", () => {
  expect(US35("gedcomTestData_US35")).toBe(false);
});

test("Test US36", () => {
  expect(US36("gedcomTestData_US36")).toBe(false);
});

test("Test US28", () => {
  expect(US28("gedcomTestData_US28")).toBe(false);
});

test("Test US29", () => {
  expect(US29("gedcomTestData_US29")).toBe(false);
});
