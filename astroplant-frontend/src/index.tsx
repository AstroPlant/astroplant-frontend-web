import i18n from "i18next";
import ReactDOM from "react-dom";
import { initReactI18next } from "react-i18next";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./App";
import * as actions from "./modules/generic/actions";
import * as serviceWorker from "./serviceWorker";
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
  });

store.dispatch(actions.pageInitializationSuccess());
window.addEventListener("load", () => {
  store.dispatch(actions.pageLoadSuccess());
});

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
