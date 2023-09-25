import { store } from "@/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import dynamic from "next/dynamic";

const NoSSR = dynamic(
  () => {
    return import("../components/nossr");
  },
  { ssr: false }
);
export default function App({ Component, pageProps }) {
  return (
    <NoSSR>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </NoSSR>
  );
}
