import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster />
    </Layout>
  );
}