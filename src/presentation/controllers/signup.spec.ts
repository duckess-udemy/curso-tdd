import { SignUpController } from "./signup";
import { MissingParamError } from "../errors/missing-param-error";

const makeSut = (): SignUpController => new SignUpController();

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", () => {
    const sut = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        email: "any-email",
        password: "any-password",
        passwordConfirmation: "any-password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
  test("should return 400 if no email is provided", () => {
    const sut = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        name: "any-name",
        password: "any-password",
        passwordConfirmation: "any-password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
  test("should return 400 if no password is provided", () => {
    const sut = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        name: "any-name",
        email: "any-email",
        passwordConfirmation: "any-password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
  test("should return 400 if no passwordConfirmation is provided", () => {
    const sut = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        name: "any-name",
        email: "any-email",
        password: "any-password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });
});
