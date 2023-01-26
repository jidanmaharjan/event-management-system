import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";

import { ReactQueryDevtools } from "react-query/devtools";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ContextProvider } from "./contexts/ContextProvider";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ContextProvider>
        <MantineProvider withNormalizeCSS withGlobalStyles>
          <NotificationsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </NotificationsProvider>
        </MantineProvider>
      </ContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
