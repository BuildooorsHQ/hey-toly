import { NextApiRequest } from "next";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  BorshAccountsCoder,
  BN,
} from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

import { CONNECTION } from "../../../constants.ts";

interface AccountInfo {
  address: string;
  balance: number;
  extended: string;
}

function stringifyAnchorObject(obj: any): any {
  if (obj instanceof BN) {
    return obj.toString();
  }

  if (obj instanceof PublicKey) {
    return obj.toString();
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
      acc[key] = stringifyAnchorObject(obj[key]);
      return acc;
    }, {});
  }

  return obj;
}

async function getParsedAccountInfo(
  connection: Connection,
  accountAddress: PublicKey
): Promise<AccountInfo> {
  const accountInfo = await connection.getAccountInfo(accountAddress);

  if (accountInfo?.owner && !accountInfo.executable) {
    try {
      const program = await Program.at(
        accountInfo.owner,
        new AnchorProvider(connection, new NodeWallet(Keypair.generate()), {
          commitment: "confirmed",
        })
      );

      const rawData = accountInfo.data;
      const coder = new BorshAccountsCoder(program.idl);
      const accountDefTmp = program.idl.accounts?.find((accountType: any) =>
        (rawData as Buffer)
          .slice(0, 8)
          .equals(BorshAccountsCoder.accountDiscriminator(accountType.name))
      );

      if (accountDefTmp) {
        const accountDef = accountDefTmp;
        const decodedAccountData = stringifyAnchorObject(
          coder.decode(accountDef.name, rawData)
        );

        const payload: AccountInfo = {
          ...accountInfo,
          extended: JSON.stringify(decodedAccountData),
        };
        return payload;
      }
    } catch (err) {
      console.log(err);
    }
  }
  return accountInfo || {};
}

export default async function getAccountInfo(
  req: NextApiRequest
): Promise<AccountInfo> {
  try {
    console.log("getAccountInfo: Request received", req.body);

    const { address } = req.body;

    const accountAddress = new PublicKey(address);
    const accountInfo = await getParsedAccountInfo(CONNECTION, accountAddress);

    console.log("getAccountInfo: Account info retrieved", accountInfo);

    return accountInfo;
  } catch (error) {
    console.error("getAccountInfo: Error occurred", error);
    throw error;
  }
}
