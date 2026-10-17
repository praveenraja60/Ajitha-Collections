import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import CollectionsPage from './pages/Collections.tsx'
import ProductDetailsPage from './pages/ProductDetails.tsx'
import CartPage from './pages/Cart.tsx'
import WishlistPage from './pages/Wishlist.tsx'
import { CartProvider } from './lib/cart.tsx'

createRoot(document.getElementById('root')!).render(
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<CollectionsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/collections/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </CartProvider>,
)
