import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import { SessionProvider } from "next-auth/react";
import { GlobalProvider } from "@/context/GlobalContext";
import { Notifications } from "@/components/Notifications";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <GlobalProvider>
        <Layout>
          <Component {...pageProps} />
          <Toaster />
          <Notifications />
        </Layout>
      </GlobalProvider>
    </SessionProvider>
  );
}