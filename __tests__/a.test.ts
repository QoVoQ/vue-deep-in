import "__tests__/helpers/mock-console";
console.log("before test");
describe("ddd", () => {
  it("eee", () => {
    console.log("eeee");
    console.log(11111);
    expect((console.log as jest.Mock).mock.calls[0][0]).toBe("eeee");
    expect((console.log as jest.Mock).mock.calls[1][0]).toBe(11111);
  });
  it("fff", () => {
    console.log("fff");
    expect((console.log as jest.Mock).mock.calls[0][0]).toBe("fff");
  });
});

console.log("after test");
