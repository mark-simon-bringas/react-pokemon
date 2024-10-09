import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './Header'
import Footer from './Footer'
import Filters from './Filters'

function App() {
  return (
    <>
      <Header />
      <Filters />
      <Footer />
    </>
  )
}

export default App
