import Head from "next/head";
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import Home from "../pages/index";

const sendQuery = async () => {
  const profile = await fcl.query({
    cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
    args: (arg, t) => [arg(Home.user.addr, t.Address)],
  });

  setName(profile?.name ?? "No Profile");
};

const initAccount = async () => {
  const transactionId = await fcl.mutate({
    cadence: `
        import Profile from 0xProfile

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
        }
      `,
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 50,
  });

  const transaction = await fcl.tx(transactionId).onceSealed();
  console.log(transaction);
};

// NEW
const executeTransaction = async () => {
  const transactionId = await fcl.mutate({
    cadence: `
        import Profile from 0xProfile

        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
        }
      `,
    args: (arg, t) => [arg("Flow Developer!", t.String)],
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 50,
  });

  fcl.tx(transactionId).subscribe((res) => setTransactionStatus(res.status));
};

const AuthedState = () => {
  return (
    <div>
      <div id="act_details">
        <div>Address: {Home.user?.addr ?? "No Address"}</div>
        <div>Profile Name: {name ?? "--"}</div>
        <div>Transaction Status: {Home.transactionStatus ?? "--"}</div>{" "}
        {/* NEW */}
      </div>
      <button onClick={sendQuery}>Send Query</button>
      <button onClick={initAccount}>Init Account</button>
      <button onClick={executeTransaction}>Execute Transaction</button>{" "}
      {/* NEW */}
      <button onClick={fcl.unauthenticate}>Log Out</button>
    </div>
  );
};

export default AuthedState;
