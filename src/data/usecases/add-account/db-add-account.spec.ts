import { DbAddAccount } from "./db-add-account";

describe("DBAddAccount Usecase", () => {
  test("should call Encrypter with correct password", async () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return Promise.resolve("hashed-password");
      }
    }
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
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
