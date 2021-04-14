const { parseGedcom, US01 } = require("./gedcomParser");

test("Testing Base Case", () => {
  expect(parseGedcom("gedcomTestDataBase").noError).toBe(true);
});
