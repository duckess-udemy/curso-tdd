import { Encrypter } from "@data/protocols/encrypter";
import bcrypt from "bcrypt";

export class BcryptAdapter implements Encrypter {
  private readonly bcryptSalt: number;
  constructor(bcryptSalt: number) {
    this.bcryptSalt = bcryptSalt;
  }

  async encrypt(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.bcryptSalt);
    return hashedValue;
  }
}
