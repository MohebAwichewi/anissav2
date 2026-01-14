'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Product = { id: number; name: string; price: number; images: string[], stock?: number }
type CartItem = Product & { quantity: number }

interface ShopContextType {
  cart: CartItem[]
  wishlist: Product[]
  addToCart: (product: Product, qty?: number) => void // <--- Updated to accept qty
  removeFromCart: (id: number) => void
  addToWishlist: (product: Product) => void
  removeFromWishlist: (id: number) => void
  clearCart: () => void
  cartTotal: number
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('ma_cart')
    const savedWish = localStorage.getItem('ma_wishlist')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWish) setWishlist(JSON.parse(savedWish))
  }, [])

  useEffect(() => { localStorage.setItem('ma_cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('ma_wishlist', JSON.stringify(wishlist)) }, [wishlist])

  // UPDATED: Accepts quantity (defaults to 1)
  const addToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + qty } : p)
      }
      return [...prev, { ...product, quantity: qty }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(p => p.id !== id))
  }

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) return prev
      return [...prev, product]
    })
  }

  const removeFromWishlist = (id: number) => {
    setWishlist(prev => prev.filter(p => p.id !== id))
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <ShopContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, addToWishlist, removeFromWishlist, clearCart, cartTotal }}>
      {children}
    </ShopContext.Provider>
  )
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used within ShopProvider')
  return context
}