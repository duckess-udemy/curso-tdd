import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";
describe("Bcrypt Adapter", () => {
  test("should call bcrypt with correct params", async () => {
    const bcryptSalt = 12;
    const sut = new BcryptAdapter(bcryptSalt);
    const encryptValue = "any_value";
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt(encryptValue);
    expect(hashSpy).toHaveBeenCalledWith(encryptValue, bcryptSalt);
  });
});
