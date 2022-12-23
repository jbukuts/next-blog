import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React from "react";
import { Header } from "../components";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Header />
    <main>
      <Component {...pageProps} />
    </main>
    <footer />
  </>
);

export default App;
