'use client'
import { useState, useEffect, useRef, FormEvent } from 'react'
import { ShopProvider, useShop } from './context/ShopContext'

// --- INNER COMPONENT (Where all the logic lives) ---
function ShopContent() {
  // 1. Get Cart Logic from Context
  const { cart, wishlist, addToCart, removeFromCart, addToWishlist, removeFromWishlist, cartTotal, clearCart } = useShop()
  
  const [loaded, setLoaded] = useState<boolean>(false)
  const [activePage, setActivePage] = useState<string>('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)
  
  // 2. Sidebar States
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)

  // 3. Data States (Real DB)
  const [dbProducts, setDbProducts] = useState<any[]>([]) 
  const [categories, setCategories] = useState<any[]>([]) 
  const [selectedCategory, setSelectedCategory] = useState('Tout Voir') 
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  
  // 4. Quantity State (For the selectors on product cards)
  const [selectedQtys, setSelectedQtys] = useState<{[key: number]: number}>({})

  // --- 5. LIGHTBOX STATES ---
  // Simple Lightbox for Gallery Page
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)
  const [currentLbImages, setCurrentLbImages] = useState<string[]>([]) 
  const [currentLbIndex, setCurrentLbIndex] = useState<number>(0)

  // NEW: Quick View Modal State (Stores the full product object)
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null)

  // 6. Forms (Checkout & Contact)
  const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '' })
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [isSending, setIsSending] = useState(false)
  
  // Success Message
  const [showSuccess, setShowSuccess] = useState('') 

  const cursorRef = useRef<HTMLDivElement>(null)

  // --- DATA FETCHING ---
  useEffect(() => {
    setLoaded(true)
    fetch('/api/products').then(r => r.json()).then(d => { if(Array.isArray(d)) setDbProducts(d) })
    fetch('/api/categories').then(r => r.json()).then(d => { if(Array.isArray(d)) setCategories(d) })
    fetch('/api/gallery').then(r => r.json()).then(d => { if(Array.isArray(d)) setGalleryImages(d) })
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible') })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, []) 

  // --- EVENTS ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    const handleMouseMove = (e: MouseEvent) => {
       if (cursorRef.current) { cursorRef.current.style.left = e.clientX + 'px'; cursorRef.current.style.top = e.clientY + 'px' }
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('mousemove', handleMouseMove) }
  }, [])

  // --- HELPER FUNCTIONS ---
  const addHover = () => document.body.classList.add('hovering')
  const removeHover = () => document.body.classList.remove('hovering')
  const switchPage = (id: string) => { setActivePage(id); window.scrollTo(0, 0); setMobileMenuOpen(false) }

  // --- SIMPLE LIGHTBOX ACTIONS (Gallery Page Only) ---
  const openLb = (images: string[]) => {
    setCurrentLbImages(images)
    setCurrentLbIndex(0)
    setLightboxOpen(true)
  }

  const nextImage = (e: any) => {
    e.stopPropagation()
    setCurrentLbIndex(prev => (prev + 1) % currentLbImages.length)
  }
  const prevImage = (e: any) => {
    e.stopPropagation()
    setCurrentLbIndex(prev => (prev - 1 + currentLbImages.length) % currentLbImages.length)
  }

  // --- QTY LOGIC ---
  const updateQty = (pid: number, delta: number) => {
    setSelectedQtys(prev => {
      const current = prev[pid] || 1
      const newVal = Math.max(1, current + delta)
      return { ...prev, [pid]: newVal }
    })
  }

  // --- CONTACT SUBMIT ---
  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm)
    })
    if (res.ok) {
      setShowSuccess('Message envoyé avec succès !')
      setContactForm({ name: '', email: '', message: '' })
      setTimeout(() => setShowSuccess(''), 4000)
    } else { alert('Une erreur est survenue.') }
    setIsSending(false)
  }

  // --- CHECKOUT SUBMIT ---
  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault()
    if(cart.length === 0) return alert('Votre panier est vide.')
    setIsCheckingOut(true)

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        cart,
        total: cartTotal,
        customerInfo: checkoutForm
      })
    })

    if(res.ok) {
      setShowSuccess('Commande validée ! Merci.')
      clearCart()
      setCartOpen(false)
      setTimeout(() => setShowSuccess(''), 4000)
    } else {
      alert('Erreur lors de la commande.')
    }
    setIsCheckingOut(false)
  }

  const filteredProducts = selectedCategory === 'Tout Voir' ? dbProducts : dbProducts.filter(p => p.category === selectedCategory)

  return (
    <>
      {/* SUCCESS TOAST */}
      <div className={`success-toast ${showSuccess ? 'show' : ''}`}>
        <div style={{fontSize: '1.2rem'}}>✅</div>
        <div><strong>{showSuccess}</strong></div>
      </div>

      <style jsx>{`
        /* --- IMAGE HOVER EFFECT CSS --- */
        .shop-img {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 3/4;
        }
        .img-main { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.4s ease; opacity: 1; }
        .img-hover { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.4s ease; z-index: 2; }
        .shop-card:hover .img-hover { opacity: 1; }

        /* NEW QUICK VIEW BUTTON ON CARD */
        .quick-view-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(0,0,0,0.8);
            color: white;
            text-align: center;
            padding: 10px;
            font-weight: 500;
            text-transform: uppercase;
            font-size: 0.9rem;
            opacity: 0;
            transform: translateY(100%);
            transition: all 0.3s ease;
            z-index: 10;
            cursor: pointer;
        }
        .shop-img:hover .quick-view-bar {
            opacity: 1;
            transform: translateY(0);
        }

        /* --- QUICK VIEW MODAL CSS --- */
        #qv-modal { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:10000; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:0.3s; padding: 20px; }
        #qv-modal.active { opacity:1; pointer-events:auto; }
        
        .qv-content { background: white; width: 100%; max-width: 900px; max-height: 90vh; overflow-y: auto; border-radius: 8px; position: relative; padding: 30px;box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
        .close-qv { position: absolute; top: 15px; right: 20px; font-size: 30px; cursor: pointer; color: #333; z-index: 1; }
        
        .qv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        
        /* Left Column: Images */
        .qv-images { display: flex; flex-direction: column; gap: 15px; }
        .qv-main-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 4px; }
        .qv-thumbnails { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; }
        .qv-thumb { width: 60px; height: 80px; object-fit: cover; cursor: pointer; border: 2px solid transparent; border-radius: 4px; transition: 0.2s; }
        .qv-thumb.active { border-color: #A67C52; }

        /* Right Column: Details */
        .qv-details { display: flex; flex-direction: column; }
        .qv-title { font-family: var(--font-head); font-size: 2rem; margin-bottom: 10px; color: #1A3C34; }
        .qv-price { font-size: 1.25rem; font-weight: 600; color: #A67C52; margin-bottom: 20px; }
        .qv-description { color: #666; line-height: 1.6; margin-bottom: 30px; font-size: 0.95rem; }
        
        .qv-actions { margin-top: auto; display: flex; flex-direction: column; gap: 20px; }
        .btn-add-cart-large {
            background: #111; color: white; width: 100%; padding: 15px;
            text-align: center; text-transform: uppercase; font-weight: 700;
            border: none; border-radius: 4px; cursor: pointer; transition: 0.2s;
            letter-spacing: 1px;
        }
        .btn-add-cart-large:hover { background: #333; }


        /* --- EXISTING STYLES --- */
        .success-toast { position: fixed; bottom: 30px; right: 30px; background: #1A3C34; color: white; padding: 20px 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 15px; z-index: 20000; transform: translateY(100px); opacity: 0; transition: all 0.5s; pointer-events: none; }
        .success-toast.show { transform: translateY(0); opacity: 1; pointer-events: auto; }
        
        .sidebar-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index: 9000; opacity:0; pointer-events:none; transition:0.3s; }
        .sidebar-overlay.active { opacity:1; pointer-events:auto; }
        .shop-sidebar-panel { position: fixed; top:0; right:0; width:400px; max-width:85%; height:100%; background:white; z-index: 9100; transform:translateX(100%); transition:0.4s cubic-bezier(0.77, 0, 0.175, 1); padding: 30px; display:flex; flex-direction:column; box-shadow:-10px 0 30px rgba(0,0,0,0.1); }
        .shop-sidebar-panel.active { transform:translateX(0); }
        .sidebar-header { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:15px; margin-bottom:20px; }
        .sidebar-title { font-family: var(--font-head); font-size: 1.5rem; }
        .close-sidebar { font-size: 1.5rem; cursor:pointer; }
        
        .cart-item { display:flex; gap:15px; margin-bottom:20px; align-items:center; }
        .cart-img { width:60px; height:60px; object-fit:cover; border-radius:6px; }
        .cart-details { flex:1; }
        .cart-name { font-weight:600; font-size:0.9rem; }
        .cart-price { color: #666; font-size:0.85rem; }
        .remove-link { color:#ef4444; font-size:0.75rem; cursor:pointer; text-decoration:underline; }
        
        .checkout-area { margin-top:auto; border-top:1px solid #eee; padding-top:20px; }
        .total-row { display:flex; justify-content:space-between; font-weight:700; font-size:1.2rem; margin-bottom:20px; }
        .checkout-input { width:100%; padding:12px; margin-bottom:10px; border:1px solid #ddd; border-radius:6px; font-family:inherit; }
        .btn-checkout { width:100%; padding:15px; background:#1A3C34; color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer; transition:0.2s; }
        .btn-checkout:disabled { background:#ccc; }
        
        .badge-count { position:absolute; top:-5px; right:-5px; background:#A67C52; color:white; font-size:10px; width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
        
        .category-list li a { cursor: pointer; display: block; padding: 5px 0; color: var(--text-soft); transition: 0.3s; }
        .category-list li a:hover, .category-list li.active a { color: var(--text-gold); transform: translateX(5px); font-weight: 600; }

        .qty-selector { display:flex; align-items:center; border:1px solid #ddd; border-radius:6px; overflow:hidden; width: 80px; height: 32px; }
        .qty-btn { width:25px; height:100%; border:none; background:#f9f9f9; cursor:pointer; font-weight:bold; color:#555; display:flex; align-items:center; justify-content:center; }
        .qty-btn:hover { background:#eee; }
        .qty-val { flex:1; text-align:center; font-size:0.85rem; font-weight:600; }

        /* SIMPLE LIGHTBOX CSS */
        #lightbox { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:10000; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:0.3s; }
        #lightbox.active { opacity:1; pointer-events:auto; }
        .lb-content { position: relative; max-width: 90%; max-height: 90%; display:flex; flex-direction:column; align-items:center; }
        #lb-img { max-width:100%; max-height:80vh; border-radius:4px; box-shadow:0 20px 50px rgba(0,0,0,0.5); object-fit:contain; }
        .close-lb { position:absolute; top:30px; right:30px; font-size:40px; color:white; cursor:pointer; z-index:10001; transition:0.2s; }
        .close-lb:hover { transform:scale(1.1); color:#A67C52; }
        .lb-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.1); color: white; border: none; font-size: 3rem; padding: 10px 20px; cursor: pointer; border-radius: 50%; transition: 0.2s; user-select:none; }
        .prev { left: -80px; }
        .next { right: -80px; }
        .lb-dots { margin-top:20px; display: flex; gap: 10px; }
        .lb-dots span { width: 10px; height: 10px; background: rgba(255,255,255,0.3); border-radius: 50%; cursor: pointer; transition:0.2s; }
        .lb-dots span.active { background: #A67C52; transform:scale(1.2); }

        /* SOCIAL ICONS */
        .social-link { transition: transform 0.2s, color 0.2s; color: var(--text-soft); }
        .social-link:hover { transform: translateY(-3px); color: var(--text-gold); }

        /* --- NEW SECTION: L'ATELIER (UPDATED COLORS) --- */
        .atelier-section {
            background-color: #C3E6D7; /* Updated Mint Green */
            color: #1A3C34; /* Dark Text */
            padding: 80px 0;
            overflow: hidden;
            position: relative;
        }
        
        .marquee-container {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            margin-bottom: 60px;
            border-top: 1px solid rgba(26, 60, 52, 0.1);
            border-bottom: 1px solid rgba(26, 60, 52, 0.1);
            padding: 20px 0;
        }
        
        .marquee-text {
            display: inline-block;
            font-family: var(--font-head);
            font-size: 4rem;
            color: rgba(26, 60, 52, 0.05); /* Subtle dark text */
            text-transform: uppercase;
            animation: marquee 20s linear infinite;
        }

        .atelier-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            text-align: center;
        }

        .atelier-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            opacity: 0;
            transform: translateY(30px);
            transition: 0.8s ease-out;
        }
        
        .atelier-card.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        .arch-img-frame {
            width: 100%;
            height: 400px;
            border-radius: 200px 200px 0 0; /* Arch Shape */
            overflow: hidden;
            margin-bottom: 25px;
            position: relative;
        }

        .arch-img-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
            filter: grayscale(30%);
        }

        .atelier-card:hover .arch-img-frame img {
            transform: scale(1.05);
            filter: grayscale(0%);
        }

        .atelier-title {
            font-family: var(--font-head);
            font-size: 1.8rem;
            margin-bottom: 10px;
            color: #1A3C34; /* Dark Brand Color */
        }

        .atelier-desc {
            font-size: 0.95rem;
            color: rgba(26, 60, 52, 0.8);
            max-width: 80%;
            line-height: 1.6;
        }

        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        @media(max-width: 768px) {
           .prev { left: -20px; font-size: 2rem; background:rgba(0,0,0,0.5); }
           .next { right: -20px; font-size: 2rem; background:rgba(0,0,0,0.5); }
           .qv-grid { grid-template-columns: 1fr; gap: 20px; }
           .qv-details { align-items: center; text-align: center; }
           
           /* Atelier Mobile */
           .atelier-grid { grid-template-columns: 1fr; gap: 60px; }
           .arch-img-frame { height: 300px; }
           .marquee-text { font-size: 2.5rem; }
           
           /* Video Wall */
           .video-wall-grid { grid-template-columns: 1fr 1fr; }
           .video-column { height: 250px; }
           
           /* Lightbox */
           .prev { left: -10px; font-size: 2rem; background:rgba(0,0,0,0.3); }
           .next { right: -10px; font-size: 2rem; background:rgba(0,0,0,0.3); }
           
           /* Footer */
           .footer-grid { grid-template-columns: 1fr; text-align: center; gap: 40px; }
           .social-links { justify-content: center; }
           
           /* General */
           .container { padding: 0 20px; }
           h2 { font-size: 2rem !important; }
        }
      `}</style>

      {/* --- SIDEBARS --- */}
      <div className={`sidebar-overlay ${cartOpen ? 'active' : ''}`} onClick={() => setCartOpen(false)}></div>
      <div className={`shop-sidebar-panel ${cartOpen ? 'active' : ''}`}>
        <div className="sidebar-header"><span className="sidebar-title">Mon Panier</span><span className="close-sidebar" onClick={() => setCartOpen(false)}>×</span></div>
        <div style={{flex:1, overflowY:'auto'}}>
          {cart.length === 0 && <p style={{color:'#888'}}>Votre panier est vide.</p>}
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.images[0] || '/placeholder.jpg'} className="cart-img" />
              <div className="cart-details"><div className="cart-name">{item.name}</div><div className="cart-price">{item.quantity} x {item.price} TND</div></div>
              <span className="remove-link" onClick={() => removeFromCart(item.id)}>Retirer</span>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="checkout-area">
            <div className="total-row"><span>Total</span><span>{cartTotal} TND</span></div>
            <form onSubmit={handleCheckout}>
              <input required placeholder="Votre Nom" className="checkout-input" value={checkoutForm.name} onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} />
              <input required placeholder="Téléphone" className="checkout-input" value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} />
              <button className="btn-checkout" disabled={isCheckingOut}>{isCheckingOut ? 'Traitement...' : 'Commander'}</button>
            </form>
          </div>
        )}
      </div>

      <div className={`sidebar-overlay ${wishlistOpen ? 'active' : ''}`} onClick={() => setWishlistOpen(false)}></div>
      <div className={`shop-sidebar-panel ${wishlistOpen ? 'active' : ''}`}>
        <div className="sidebar-header"><span className="sidebar-title">Mes Favoris</span><span className="close-sidebar" onClick={() => setWishlistOpen(false)}>×</span></div>
        <div style={{flex:1, overflowY:'auto'}}>
          {wishlist.length === 0 && <p style={{color:'#888'}}>Aucun favori pour le moment.</p>}
          {wishlist.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.images[0] || '/placeholder.jpg'} className="cart-img" />
              <div className="cart-details"><div className="cart-name">{item.name}</div><div className="cart-price">{item.price} TND</div></div>
              <span className="remove-link" onClick={() => removeFromWishlist(item.id)}>Retirer</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- PRELOADER & CURSOR --- */}
      <div id="preloader" style={{ opacity: loaded ? 0 : 1, visibility: loaded ? 'hidden' : 'visible' }}><div className="loader-logo">M.A</div></div>
      <div className="cursor-butterfly" ref={cursorRef}><svg viewBox="0 0 50 50"><path d="M25,25 C15,10 5,20 5,25 C5,30 15,40 25,25 C35,40 45,30 45,25 C45,20 35,10 25,25 Z"/></svg></div>
      
      {/* --- SIMPLE LIGHTBOX (For Gallery Page) --- */}
      <div id="lightbox" className={lightboxOpen ? 'active' : ''} onClick={() => setLightboxOpen(false)}>
        <span className="close-lb" onClick={() => setLightboxOpen(false)}>×</span>
        {currentLbImages.length > 0 && <div className="lb-content" onClick={e => e.stopPropagation()}><img id="lb-img" src={currentLbImages[0]} /></div>}
      </div>

      {/* --- NEW: QUICK VIEW MODAL (REAL DATA) --- */}
      <div id="qv-modal" className={quickViewProduct ? 'active' : ''} onClick={() => setQuickViewProduct(null)}>
         <div className="qv-content" onClick={e => e.stopPropagation()}>
            <span className="close-qv" onClick={() => setQuickViewProduct(null)}>×</span>
            {quickViewProduct && (
                <div className="qv-grid">
                    {/* Left Column: Images */}
                    <div className="qv-images">
                        <img src={quickViewProduct.images[currentLbIndex] || quickViewProduct.images[0]} className="qv-main-img" />
                        {quickViewProduct.images.length > 1 && (
                            <div className="qv-thumbnails">
                                {quickViewProduct.images.map((img: string, i: number) => (
                                    <img 
                                        key={i} 
                                        src={img} 
                                        className={`qv-thumb ${i === currentLbIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentLbIndex(i)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details */}
                    <div className="qv-details">
                        <h2 className="qv-title">{quickViewProduct.name}</h2>
                        <p className="qv-price">{quickViewProduct.price} TND</p>
                        
                        {/* Placeholder for description - replace if you add a description field to DB */}
                        <p className="qv-description">Découvrez l'élégance intemporelle de cette pièce unique, alliant tradition et modernité. Conçue avec des matériaux de qualité pour un confort exceptionnel.</p>

                        <div className="qv-actions">
                             {/* Quantity Selector */}
                             <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                 <span style={{fontWeight:'600', fontSize:'0.9rem'}}>Quantité:</span>
                                 <div className="qty-selector">
                                    <button className="qty-btn" onClick={() => updateQty(quickViewProduct.id, -1)}>-</button>
                                    <span className="qty-val">{selectedQtys[quickViewProduct.id] || 1}</span>
                                    <button className="qty-btn" onClick={() => updateQty(quickViewProduct.id, 1)}>+</button>
                                 </div>
                             </div>

                             {/* Real Add to Cart Button */}
                             <button className="btn-add-cart-large" onClick={() => {
                                 addToCart(quickViewProduct, selectedQtys[quickViewProduct.id] || 1);
                                 setQuickViewProduct(null); // Close modal
                                 setCartOpen(true); // Open cart sidebar
                             }}>
                                 + AJOUTER AU PANIER
                             </button>
                             
                             <div style={{display:'flex', gap:'10px', marginTop:'10px', fontSize:'0.85rem'}}>
                                 <span>🚚 Livraison 24h-48h</span>
                                 <span>♡ Satisfait ou remboursé</span>
                             </div>
                        </div>
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* --- HEADER --- */}
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="glass-nav">
          <div className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>☰</div>
          <div className="logo-text" onClick={() => switchPage('home')}><h1>M.A</h1><span>Tradition</span></div>
          <nav className="desktop-nav">
            <ul>
              <li><a onClick={() => switchPage('home')} className={activePage==='home'?'active-link':''}>Accueil</a></li>
              <li><a onClick={() => switchPage('shop')} className={activePage==='shop'?'active-link':''}>Collections</a></li>
              <li><a onClick={() => switchPage('gallery')} className={activePage==='gallery'?'active-link':''}>Galerie</a></li>
              <li><a onClick={() => switchPage('contact')} className={activePage==='contact'?'active-link':''}>Contact</a></li>
            </ul>
          </nav>
          <div className="nav-icons">
            <span style={{position:'relative', cursor:'pointer'}} onClick={() => setWishlistOpen(true)}>
              ♡
              {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
            </span>
            <span style={{position:'relative', cursor:'pointer'}} onClick={() => setCartOpen(true)}>
              👜
              {cart.length > 0 && <span className="badge-count">{cart.length}</span>}
            </span>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}><span className="close-btn" onClick={() => setMobileMenuOpen(false)}>✕</span><ul><li><a onClick={() => switchPage('home')}>Accueil</a></li><li><a onClick={() => switchPage('shop')}>Collections</a></li><li><a onClick={() => switchPage('gallery')}>Galerie</a></li><li><a onClick={() => switchPage('contact')}>Contact</a></li></ul></div>

      <main>
        {/* --- HOME PAGE --- */}
        <div id="home" className={`page-section fade-in ${activePage === 'home' ? '' : 'hidden'}`}>
          <section className="hero">
            <div className="container hero-inner">
              <div className="hero-text"><span className="sub-title">L'Art de Vivre</span><h1>L'Élégance<br/>Intemporelle</h1><p>Une réinterprétation audacieuse du patrimoine tunisien.</p><a onClick={() => switchPage('shop')} className="btn hover-trigger" onMouseEnter={addHover} onMouseLeave={removeHover}>Explorer la Maison</a></div>
              <div className="hero-visual"><div className="hero-blob"></div><div className="hero-img-frame"><img src="/image1.jpeg" alt="Hero"/></div></div>
            </div>
          </section>

          <section className="collections-section reveal-section">
            <div className="container"><div className="section-header"><span className="sub-title">Découverte</span><h2>Nos Collections</h2></div></div>
            <div className="scroll-container">
              <div className="collection-card hover-trigger" onMouseEnter={addHover} onMouseLeave={removeHover}><img src="/image6.jpeg"/><div className="collection-overlay"><h3>Femme</h3></div></div>
              <div className="collection-card hover-trigger" onMouseEnter={addHover} onMouseLeave={removeHover}><img src="/image3.jpeg"/><div className="collection-overlay"><h3>Homme</h3></div></div>
              <div className="collection-card hover-trigger" onMouseEnter={addHover} onMouseLeave={removeHover}><img src="/image5.jpeg"/><div className="collection-overlay"><h3>Enfant</h3></div></div>
              <div className="collection-card hover-trigger" onMouseEnter={addHover} onMouseLeave={removeHover}><img src="/image2.jpeg"/><div className="collection-overlay"><h3>Bébé</h3></div></div>
            </div>
          </section>

          <section className="signature-section reveal-section">
            <div className="container sig-wrapper">
              <div className="sig-text"><span style={{textTransform:'uppercase', letterSpacing:'2px', color:'var(--text-gold)'}}>Fondatrice</span><h2>L'Âme de la Maison</h2><div className="sig-quote">"La tradition n'est pas le culte des cendres."</div><div style={{fontFamily:'var(--font-sign)', fontSize:'3.5rem'}}>Mezhoud Anissa</div></div>
              <div className="sig-visual"><div className="sig-frame"><img src="/anissa2.jpeg"/></div></div>
            </div>
          </section>

          <section className="new-feature-section reveal-section">
            <div className="container new-feat-wrapper">
              <div className="new-feat-text"><h2>L'Excellence du Détail</h2><p>Nous accordons une attention obsessionnelle aux finitions.</p><a onClick={() => switchPage('shop')} className="btn hover-trigger" onMouseEnter={addHover} onMouseLeave={removeHover}>Voir les Détails</a></div>
              <div className="new-feat-visual"><div className="new-feat-shape"></div><div className="new-feat-img-frame"><img src="/image44.jpeg"/></div></div>
            </div>
          </section>

          {/* --- NEW SECTION: L'ATELIER --- */}
          <section className="atelier-section reveal-section">
             <div className="marquee-container">
                 <div className="marquee-text">
                     Tradition • Modernité • Élégance • Artisanat • Passion • Heritage • 
                     Tradition • Modernité • Élégance • Artisanat • Passion • Heritage •
                 </div>
             </div>
             
             <div className="container" style={{textAlign:'center', marginBottom:'50px'}}>
                 <span className="sub-title" style={{color:'#1A3C34'}}>Savoir-Faire</span>
                 <h2 style={{fontSize:'2.5rem', marginTop:'10px'}}>L'ATELIER DES RÊVES</h2>
             </div>

             <div className="container">
                 <div className="atelier-grid">
                     <div className="atelier-card reveal-section">
                         <div className="arch-img-frame">
                             <img src="/image5.jpeg" alt="Broderie" />
                         </div>
                         <h3 className="atelier-title">Le Fil d'Or</h3>
                         <p className="atelier-desc">Chaque point est une promesse. Nos broderies sont réalisées à la main, perpétuant des gestes centenaires.</p>
                     </div>
                     <div className="atelier-card reveal-section" style={{transitionDelay:'0.2s'}}>
                         <div className="arch-img-frame">
                             <img src="/image13.jpeg" alt="Tissus" />
                         </div>
                         <h3 className="atelier-title">L'Étoffe</h3>
                         <p className="atelier-desc">Soie sauvage, lin pur, velours. Nous sélectionnons les matières les plus nobles pour un toucher d'exception.</p>
                     </div>
                     <div className="atelier-card reveal-section" style={{transitionDelay:'0.4s'}}>
                         <div className="arch-img-frame">
                             <img src="/image14.jpeg" alt="Confection" />
                         </div>
                         <h3 className="atelier-title">L'Artisan</h3>
                         <p className="atelier-desc">Derrière chaque création, il y a une passion. Celle de sublimer l'héritage tunisien.</p>
                     </div>
                 </div>
             </div>
          </section>

          <section className="video-wall-section reveal-section">
            <div className="video-wall-grid">
              <div className="video-column"><video src="/video1.mp4" autoPlay loop muted></video><div className="video-overlay-text"><div className="video-title">Fil</div></div></div>
              <div className="video-column"><video src="/video2.mp4" autoPlay loop muted></video><div className="video-overlay-text"><div className="video-title">Soie</div></div></div>
              <div className="video-column"><video src="/video3.mp4" autoPlay loop muted></video><div className="video-overlay-text"><div className="video-title">Lin</div></div></div>
              <div className="video-column"><video src="/video4.mp4" autoPlay loop muted></video><div className="video-overlay-text"><div className="video-title">Or</div></div></div>
            </div>
          </section>

          {/* MOVED: HERITAGE SECTION */}
          <section className="feature-section reveal-section">
            <div className="container feature-wrapper">
              <div className="feature-text"><span className="sub-title">Authenticité</span><h2>L'HÉRITAGE SUBLIMÉ</h2><p>M.A Tradition incarne la rencontre entre le savoir-faire ancestral tunisien et une élégance contemporaine.</p><div className="feature-signature">Mezhoud Anissa</div><div className="feature-role">FONDATEUR</div></div>
              <div className="feature-visual"><div className="feature-shape"></div><div className="dots dots-1"><span></span><span></span><span></span><span></span></div><div className="feature-img-frame"><img src="/anissa3.jpg"/></div></div>
            </div>
          </section>
        </div>

        {/* --- SHOP PAGE --- */}
        <div id="shop" className={`page-section fade-in ${activePage === 'shop' ? '' : 'hidden'}`}>
          <div style={{background:'var(--bg-mint)', padding:'180px 0 80px', textAlign:'center'}}><div className="container"><h1>Collections</h1><p>Découvrez nos créations uniques.</p></div></div>
          
          <div className="container shop-container">
            <aside className="shop-sidebar">
              <div className="filter-group"><h4>Rechercher</h4><input type="text" placeholder="Rechercher..." style={{width:'100%', padding:'15px', border:'1px solid #e0e0e0', borderRadius:'8px'}} /></div>
              <div className="filter-group"><h4>Catégories</h4><ul className="category-list"><li className={selectedCategory === 'Tout Voir' ? 'active' : ''}><a onClick={() => setSelectedCategory('Tout Voir')}>Tout Voir</a></li>{categories.map(c => (<li key={c.id} className={selectedCategory === c.name ? 'active' : ''}><a onClick={() => setSelectedCategory(c.name)}>{c.name}</a></li>))}</ul></div>
            </aside>
            <div className="shop-grid">
              {filteredProducts.map((p) => (
                <div key={p.id} className="shop-card hover-trigger" onMouseEnter={addHover} onMouseLeave={removeHover}>
                  {/* --- UPDATED: IMAGE HOVER & QUICK VIEW BUTTON --- */}
                  <div className="shop-img" onClick={() => openLb([p.images[0]])}> {/* Fallback if clicked directly, but user should use QV */}
                    <img src={p.images[0] || '/placeholder.jpg'} className="img-main" />
                    {p.images[1] && ( <img src={p.images[1]} className="img-hover" /> )}
                    
                    {/* QUICK VIEW BAR */}
                    <div 
                        className="quick-view-bar" 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            setQuickViewProduct(p); 
                            setCurrentLbIndex(0); 
                        }}
                    >
                        Quick view
                    </div>
                  </div>
                  
                  <div className="shop-info"><h3>{p.name}</h3><span className="shop-price">{p.price} TND</span></div>
                  
                  <div style={{padding:'0 15px 15px', display:'flex', gap:'8px', alignItems:'center'}}>
                     <div className="qty-selector">
                        <button className="qty-btn" onClick={() => updateQty(p.id, -1)}>-</button>
                        <span className="qty-val">{selectedQtys[p.id] || 1}</span>
                        <button className="qty-btn" onClick={() => updateQty(p.id, 1)}>+</button>
                     </div>
                     <button className="btn" style={{flex:1, padding:'8px', fontSize:'0.8rem'}} onClick={() => {addToCart(p, selectedQtys[p.id] || 1); setCartOpen(true)}}>Ajouter</button>
                     <button className="btn" style={{background:'#f3f4f6', color:'#333', padding:'8px'}} onClick={() => {addToWishlist(p); setWishlistOpen(true)}}>♡</button>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && <div style={{gridColumn:'span 3', textAlign:'center', padding:'50px', color:'#888'}}>Aucun produit trouvé.</div>}
            </div>
          </div>
        </div>

        {/* --- GALLERY PAGE --- */}
        <div id="gallery" className={`page-section fade-in ${activePage === 'gallery' ? '' : 'hidden'}`}>
          <section className="gallery-preview" style={{paddingTop:'180px'}}>
            <div className="container"><div className="section-header"><h2>Mosaïque Vivante</h2><p>Découvrez notre univers.</p></div><div className="gallery-grid">{galleryImages.map((img, index) => (<div key={img.id} className="gallery-item" onClick={() => openLb([img.url])}><img src={img.url} /><div className="gallery-overlay">Voir</div></div>))}</div></div>
          </section>
        </div>

        {/* --- CONTACT PAGE --- */}
        <div id="contact" className={`page-section fade-in ${activePage === 'contact' ? '' : 'hidden'}`}>
          <div style={{padding:'180px 0 100px'}}>
            <div className="container contact-box">
              <div className="contact-info"><h3>Restons en contact</h3><p>Pour toute question ou commande sur mesure.</p><br/><p>📍 Sfax, Tunisie</p><p>📞 +216 97 709 949</p><p>✉️ contact@matradition.com</p></div>
              <div className="contact-form" style={{flex:1}}>
                <form onSubmit={handleContactSubmit}>
                  <input type="text" className="form-input" placeholder="Votre Nom" required value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                  <input type="email" className="form-input" placeholder="Votre Email" required value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                  <textarea className="form-input" rows={4} placeholder="Votre Message" required value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})}></textarea>
                  <button className="btn hover-trigger" disabled={isSending} onMouseEnter={addHover} onMouseLeave={removeHover}>{isSending ? 'Envoi...' : 'Envoyer le Message'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">M.A Tradition</div>
              <p style={{color:'var(--text-soft)'}}>L'élégance tunisienne, sublimée au quotidien.</p>
              
              {/* SOCIAL MEDIA ICONS */}
              <div className="social-links" style={{marginTop:'20px', display:'flex', gap:'15px'}}>
                <a href="https://www.instagram.com/m.a_tradition/" target="_blank" rel="noopener noreferrer" className="social-link" onMouseEnter={addHover} onMouseLeave={removeHover}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://www.facebook.com/m.a.tradition.djebabli" target="_blank" rel="noopener noreferrer" className="social-link" onMouseEnter={addHover} onMouseLeave={removeHover}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://wa.me/21697709949" target="_blank" rel="noopener noreferrer" className="social-link" onMouseEnter={addHover} onMouseLeave={removeHover}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </a>
              </div>
            </div>
            <div><h4>Maison</h4><ul className="footer-links" style={{listStyle:'none'}}><li><a onClick={() => switchPage('home')} className="hover-trigger" onMouseEnter={addHover} onMouseLeave={removeHover}>À Propos</a></li><li><a onClick={() => switchPage('gallery')} className="hover-trigger" onMouseEnter={addHover} onMouseLeave={removeHover}>Galerie</a></li></ul></div>
            <div><h4>Aide</h4><ul className="footer-links" style={{listStyle:'none'}}><li><a onClick={() => switchPage('contact')} className="hover-trigger" onMouseEnter={addHover} onMouseLeave={removeHover}>Contact</a></li><li>Livraison</li></ul></div>
            <div><h4>Newsletter</h4><input type="email" placeholder="Votre email" className="newsletter-input hover-trigger" onMouseEnter={addHover} onMouseLeave={removeHover} /></div>
          </div>
          <div style={{textAlign:'center', marginTop:'80px', paddingTop:'30px', borderTop:'1px solid rgba(0,0,0,0.05)'}}>© 2025 M.A Tradition. Designed by Moheb.</div>
        </div>
      </footer>
    </>
  )
}

// --- 5. WRAPPER (Exports the Provider) ---
export default function Home() {
  return (
    <ShopProvider>
      <ShopContent />
    </ShopProvider>
  )
}