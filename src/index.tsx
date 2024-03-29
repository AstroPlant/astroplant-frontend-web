import i18n from "i18next";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./App";
import * as actions from "./modules/generic/actions";
import { store } from "./store";
import en from "./translations/en.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en,
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
    react: {
      transSupportBasicHtmlNodes: true,
    },
  });

store.dispatch(actions.pageInitializationSuccess());
window.addEventListener("load", () => {
  store.dispatch(actions.pageLoadSuccess());
});

const container = document.getElementById("root");
if (container === null) {
  throw new Error("could not find element to render into");
}

const root = createRoot(container);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
