import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ProductProvider } from './contexts/ProductProvider'
import { UserProvider } from './contexts/UserProvider'

function App() {

  return (
    <>
      <UserProvider>
        <ProductProvider>
          <Outlet />
        </ProductProvider>
      </UserProvider>


    </>
  )
}

export default App
