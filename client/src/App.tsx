import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ProductProvider } from './contexts/ProductProvider'
import { UserProvider } from './contexts/UserProvider'
import { OrderProvider } from './contexts/OrderProvider'

function App() {

  return (
    <>
      <UserProvider>
        <OrderProvider>
          <ProductProvider>
            <Outlet />
          </ProductProvider>
        </OrderProvider>
      </UserProvider>


    </>
  )
}

export default App
