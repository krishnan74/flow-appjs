import '@/styles/globals.css'
import { useState } from "react";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { render } from "react-dom";

export default function App({ Component, pageProps }) {
  const renderHeader = (
    <header>
      <a href="#">
        <img src="../public/flut.png" alt="" id="logo" />
      </a>
      <nav id="navbar">
        <ul>
          <li>
            <a href="LICET.html">HOME</a>
          </li>
          <li>
            <a href="register.html">WORKS</a>
          </li>
          <li id="login">
            <a href="login.html">ABOUT</a>
          </li>
        </ul>
      </nav>
    </header>
  );

  return (
    <>
      {renderHeader}
      <Component {...pageProps} />
    </>
  );
}
