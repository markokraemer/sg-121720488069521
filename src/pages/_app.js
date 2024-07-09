import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import { SessionProvider } from "next-auth/react";
import { GlobalProvider } from "@/context/GlobalContext";
import { Notifications } from "@/components/Notifications";
import { ThemeProvider } from 'next-themes';
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class">
          <GlobalProvider>
            <Layout>
              <Component {...pageProps} />
              <Toaster />
              <Notifications />
            </Layout>
          </GlobalProvider>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}