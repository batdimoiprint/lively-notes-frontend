import { ThemeProvider } from "@/components/theme-provider"
import { HashRouter } from "react-router-dom"
import AppRoute from "./routes/routes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import axios from 'axios'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createIDBPersister } from './lib/idbPersister'

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


// React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

// Axios 
axios.defaults.baseURL = import.meta.env.BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 5000;

const persister = createIDBPersister()

function App() {
  return (
    <>

      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <HashRouter>
          <QueryClientProvider client={queryClient}>
            <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
              <AppRoute />
            </PersistQueryClientProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </QueryClientProvider>
        </HashRouter>
      </ThemeProvider >

    </>
  )
}

export default App
