import 'bootstrap/dist/css/bootstrap.css'
import Head from "next/head"

export default function App({ Component, pageProps }) {
  return (
      <>
        <Head>
          <title>Bank operations</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </>
  )
}
