import { Encrypter } from "@data/protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve("hashed-password");
    }
  }
  const encrypterStub = new EncrypterStub();
  const sut = new DbAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub,
  };
};

describe("DBAddAccount Usecase", () => {
  test("should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid-name",
      email: "valid-email",
      password: "valid-password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid-password");
  });
});
