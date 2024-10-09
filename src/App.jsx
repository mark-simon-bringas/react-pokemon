import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './Header'
import Footer from './Footer'
import PokeDex from './PokeDex'

function App() {
  return (
    <>
      <Header />
      <PokeDex />
      <Footer />
    </>
  )
}

export default App
