import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount,
} from "./signup-protocols";
import {
  badRequest,
  serverError,
  success,
} from "@presentation/helpers/http-helper";
import { InvalidParamError, MissingParamError } from "@presentation/errors";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParams = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const param of requiredParams) {
        if (!httpRequest.body[param]) {
          return badRequest(new MissingParamError(param));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (passwordConfirmation !== password) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }
      const isEmailValid = this.emailValidator.isValid(email);
      if (!isEmailValid) {
        return badRequest(new InvalidParamError("email"));
      }

      const account = await this.addAccount.add({ name, email, password });

      return success(account);
    } catch (err) {
      return serverError();
    }
  }
}
