import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helper";

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredParams = ["name", "email"];
    for (const param of requiredParams) {
      if (!httpRequest.body[param]) {
        return badRequest(new MissingParamError(param));
      }
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
