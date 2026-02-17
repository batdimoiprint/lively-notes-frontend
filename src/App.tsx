import { ThemeProvider } from "@/components/theme-provider";
import AppRoute from "./routes/routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createIDBPersister } from "./lib/idbPersister";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/api/queryClient";
// React Query
const persister = createIDBPersister();

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
              <AppRoute />
            </PersistQueryClientProvider>
            {import.meta.env.PROD === true ? (
              <ReactQueryDevtools initialIsOpen={false} />
            ) : (
              <ReactQueryDevtools initialIsOpen={true} />
            )}
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
