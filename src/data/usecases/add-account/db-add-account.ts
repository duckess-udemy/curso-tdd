import { AddAccount, AddAccountModel } from "@domain/usecases/add-account";
import { AccountModel } from "@domain/models/Account";
import { Encrypter } from "@data/protocols/encrypter";

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return Promise.resolve({
      id: "any-id",
      name: "any-name",
      email: "any-email",
      password: "any-password",
    });
  }
}
