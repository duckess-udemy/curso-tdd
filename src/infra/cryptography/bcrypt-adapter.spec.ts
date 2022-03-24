import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  hash: () => {
    return Promise.resolve("hashed-value");
  },
}));

interface Sut {
  sut: BcryptAdapter;
  bcryptSalt: number;
}
const makeSut = (): Sut => {
  const bcryptSalt = 12;
  const sut = new BcryptAdapter(bcryptSalt);
  return { sut, bcryptSalt };
};

describe("Bcrypt Adapter", () => {
  test("should call bcrypt with correct params", async () => {
    const { sut, bcryptSalt } = makeSut();
    const encryptValue = "any_value";
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt(encryptValue);
    expect(hashSpy).toHaveBeenCalledWith(encryptValue, bcryptSalt);
  });
  test("should return a hash on success", async () => {
    const { sut } = makeSut();
    const result = await sut.encrypt("any_value");
    expect(result).toBe("hashed-value");
  });
  test("should throw if bcrypt throws", async () => {
    const { sut } = makeSut();
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(() => Promise.reject(new Error()));
    const result = sut.encrypt("any_value");
    await expect(result).rejects.toThrow();
  });
});
