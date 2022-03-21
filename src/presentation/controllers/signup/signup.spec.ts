import { SignUpController } from "./signup";
import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from "@presentation/errors";
import {
  EmailValidator,
  AccountModel,
  AddAccountModel,
  AddAccount,
} from "./signup-protocols";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class MakeAddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve({
        ...account,
        id: "valid-id",
      });
    }
  }
  return new MakeAddAccountStub();
};

interface Sut {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSut = (): Sut => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", async () => {
    const { sut } = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        email: "any-email",
        password: "any-password",
        passwordConfirmation: "any-password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        name: "any-name",
        password: "any-password",
        passwordConfirmation: "any-password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
  test("should return 400 if no password is provided", async () => {
    const { sut } = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        name: "any-name",
        email: "any-email",
        passwordConfirmation: "any-password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
  test("should return 400 if no passwordConfirmation is provided", async () => {
    const { sut } = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        name: "any-name",
        email: "any-email",
        password: "any-password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });

  test("should return 400 if invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut(); // sut = system under test
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "any-name",
        email: "invalid-email",
        password: "any-password",
        passwordConfirmation: "any-password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("should return 400 if password confirmation fails", async () => {
    const { sut } = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        name: "any-name",
        email: "any-email",
        password: "any-password",
        passwordConfirmation: "invalid-password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });

  test("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut(); // sut = system under test
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = {
      body: {
        name: "any-name",
        email: "any-email@mail.com",
        password: "any-password",
        passwordConfirmation: "any-password",
      },
    };
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any-email@mail.com");
  });

  test("should return 500 if EmailValidator throws exception", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error("exception");
    });

    const httpRequest = {
      body: {
        name: "any-name",
        email: "any-email",
        password: "any-password",
        passwordConfirmation: "any-password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should call AddAccount with correct data", async () => {
    const { sut, addAccountStub } = makeSut(); // sut = system under test
    const addSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = {
      body: {
        name: "any-name",
        email: "any-email@mail.com",
        password: "any-password",
        passwordConfirmation: "any-password",
      },
    };
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any-name",
      email: "any-email@mail.com",
      password: "any-password",
    });
  });

  test("should return 500 if AddAccount throws exception", async () => {
    const { sut, addAccountStub } = makeSut();

    jest
      .spyOn(addAccountStub, "add")
      .mockImplementationOnce(() => Promise.reject(new Error("exception")));

    const httpRequest = {
      body: {
        name: "any-name",
        email: "any-email",
        password: "any-password",
        passwordConfirmation: "any-password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return 200 if valid data is provided", async () => {
    const { sut } = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        name: "valid-name",
        email: "valid-email",
        password: "valid-password",
        passwordConfirmation: "valid-password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid-id",
      name: "valid-name",
      email: "valid-email",
      password: "valid-password",
    });
  });
});
