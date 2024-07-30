import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ToDo</title>
        {/* <link rel="icon" href="images/cart-icon.png" /> */}
        <meta name="title" content="shopping-cart" />
        {/* styles, fonts, google analytics,  */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}
