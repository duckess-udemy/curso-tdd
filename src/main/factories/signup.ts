import { SignUpController } from "@presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "@utils/email-validator";
import { DbAddAccount } from "@data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "@infra/cryptography/bcrypt-adapter";
import { AccountMongoRepository } from "@infra/db/mongodb/account-repository/account";

export const makeSignUpController = (): SignUpController => {
  const bcryptSalt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(bcryptSalt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  return new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  );
};
