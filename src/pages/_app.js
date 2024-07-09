import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import { SessionProvider } from "next-auth/react";
import { GlobalProvider } from "@/context/GlobalContext";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <GlobalProvider>
        <Layout>
          <Component {...pageProps} />
          <Toaster />
        </Layout>
      </GlobalProvider>
    </SessionProvider>
  );
}