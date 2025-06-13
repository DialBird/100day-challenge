import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ShoppingList } from './components/shopping-list.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <ShoppingList />
  </StrictMode>,
)
