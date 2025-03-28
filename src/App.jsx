import { Outlet } from 'react-router-dom'
import Header from './Components/Header'
import Footer from './Components/Footer'
import { ThemeProvider } from "./Components/ThemeContext";

const App = () => {

  return (
    <>
      <ThemeProvider>
        <Header />
        <Outlet />
        <Footer />
      </ThemeProvider>
    </>
  )
}

export default App