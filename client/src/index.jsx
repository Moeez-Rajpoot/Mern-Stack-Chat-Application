import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import { UserProvider } from "./Context/UserContext.jsx";
import { SnackbarProvider } from "notistack";
import { store } from "./Redux/store.jsx";
import { Provider } from "react-redux";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <UserProvider> */}
    <Provider store={store}>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </Provider>
    {/* </UserProvider> */}
  </React.StrictMode>
);
