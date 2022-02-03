import { SignUpController } from "./signup";

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", () => {
    const sut = new SignUpController(); // sut = system under test
    const httpRequest = {
      body: {
        email: "any-email",
        password: "any-password",
        passwordConfirmation: "any-password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error("Missing param: name"));
  });
});
