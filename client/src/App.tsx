import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ProductProvider } from './contexts/ProductProvider'

function App() {

  return (
    <>
      <ProductProvider>
        <Outlet />
      </ProductProvider>

    </>
  )
}

export default App
