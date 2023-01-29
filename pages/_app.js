import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createClient, Provider } from "urql";
import { StateContextProvider } from "/lib/context";
import UserLayout from "components/layouts/UserLayout";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const client = createClient({ url: process.env.NEXT_PUBLIC_GRAPHQL_URL });
export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Provider value={client}>
        <StateContextProvider>
          <UserLayout>
            <ToastContainer />
            <Component {...pageProps} />
          </UserLayout>
        </StateContextProvider>
      </Provider>
    </UserProvider>
  );
}
