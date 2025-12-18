import { ThemeProvider } from "@/components/theme-provider"
import { HashRouter } from "react-router-dom"
import AppRoute from "./routes/routes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import axios from 'axios'


// React Query
const queryClient = new QueryClient()

// Axios 
axios.defaults.baseURL = import.meta.env.BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 5000;


function App() {
  return (
    <>

      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <HashRouter>
          <QueryClientProvider client={queryClient}>
            <AppRoute />
          </QueryClientProvider>
        </HashRouter>
      </ThemeProvider >

    </>
  )
}

export default App
