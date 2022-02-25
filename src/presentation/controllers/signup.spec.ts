import { SignUpController } from "./signup";
import { MissingParamError, InvalidParamError, ServerError } from "../errors";
import { EmailValidator } from "../protocols";

interface Sut {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): Sut => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", () => {
    const { sut } = makeSut(); // sut = system under test
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
    const { sut } = makeSut(); // sut = system under test
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
    const { sut } = makeSut(); // sut = system under test
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
    const { sut } = makeSut(); // sut = system under test
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
  test("should return 400 if invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut(); // sut = system under test
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "any-name",
        email: "invalid-email",
        password: "any-password",
        passwordConfirmation: "any-passwordConfirmation",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
  test("should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut(); // sut = system under test
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = {
      body: {
        name: "any-name",
        email: "any-email@mail.com",
        password: "any-password",
        passwordConfirmation: "any-passwordConfirmation",
      },
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any-email@mail.com");
  });

  test("should return 500 if EmailValidator throws exception", () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error("exception");
    });

    const httpRequest = {
      body: {
        name: "any-name",
        email: "any-email",
        password: "any-password",
        passwordConfirmation: "any-passwordConfirmation",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
