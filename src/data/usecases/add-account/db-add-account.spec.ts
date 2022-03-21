import { Encrypter } from "@data/protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve("hashed-password");
    }
  }
  return new EncrypterStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}
const encrypterStub = makeEncrypter();
const makeSut = (): SutTypes => {
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
  test("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
    const accountData = {
      name: "valid-name",
      email: "valid-email",
      password: "valid-password",
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});
