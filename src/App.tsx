import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter } from "react-router-dom"
import AppRoute from "./routes/routes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()
function App() {
  return (
    <>

      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AppRoute />
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider >

    </>
  )
}

export default App
