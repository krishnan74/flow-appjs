import Head from 'next/head'
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import AuthedState from "./homepage";

export default function Home() {
  const [user, setUser] = useState({ loggedIn: null });
  const [name, setName] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null); // NEW

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const UnauthenticatedState = () => {
    return (
      <div>
        <button id="LogBtn" onClick={fcl.logIn}>
          Log In
        </button>
        <button id="SignBtn" onClick={fcl.signUp}>
          Sign Up
        </button>
      </div>
    );
  };

  return (
    <div id="main">
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <h1 id="Heading">MarketPlace</h1>
      {user.loggedIn ? <AuthedState /> : <UnauthenticatedState />}
    </div>
  );
}