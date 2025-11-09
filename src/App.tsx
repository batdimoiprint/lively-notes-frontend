import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter } from "react-router-dom"
import AppRoute from "./routes/routes"

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AppRoute />
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
