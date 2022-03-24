import {
  AddAccountModel,
  Encrypter,
  AccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve("hashed-password");
    }
  }
  return new EncrypterStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve({
        id: "valid-id",
        name: "valid-name",
        email: "valid-email",
        password: "hashed-password",
      });
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
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
  test("should call AddAccountRepository with correct params", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = {
      name: "valid-name",
      email: "valid-email",
      password: "valid-password",
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid-name",
      email: "valid-email",
      password: "hashed-password",
    });
  });
  test("should throw if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockRejectedValueOnce(new Error());
    const accountData = {
      name: "valid-name",
      email: "valid-email",
      password: "valid-password",
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
  test("should return an AccountModel on success", async () => {
    const { sut } = makeSut();
    const accountData = {
      name: "valid-name",
      email: "valid-email",
      password: "valid-password",
    };
    const result = await sut.add(accountData);
    expect(result).toEqual({
      id: "valid-id",
      name: "valid-name",
      email: "valid-email",
      password: "hashed-password",
    });
  });
});
