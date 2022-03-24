import { AccountModel } from "@domain/models/Account";
import { AddAccountModel } from "@domain/usecases/add-account";

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>;
}
