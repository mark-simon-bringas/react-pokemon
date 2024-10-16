import { BrowserRouter } from 'react-router-dom'
import Footer from './Footer'
import PokeDex from './PokeDex'

function App() {
  return (
    <>
      <BrowserRouter>
        <PokeDex />
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
