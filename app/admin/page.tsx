'use client'
import { useState, useRef, FormEvent, ChangeEvent, useEffect } from 'react'

// --- ICONS ---
const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Bag: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  List: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Product: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Mail: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Alert: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // --- DATA STATES ---
  const [activeTab, setActiveTab] = useState('overview') 
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [gallery, setGallery] = useState<any[]>([]) 
  const [messages, setMessages] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([]) 

  // --- SOUND & ALERT STATE ---
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false)
  // We use a ref to track order count so the interval can see the latest value without re-running
  const prevOrderCountRef = useRef(0)

  // --- MODAL STATE ---
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null)

  // --- FORMS ---
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [prodForm, setProdForm] = useState({ 
    name: '', price: '', stock: '10', category: '', brand: 'M.A Tradition', images: [] as string[] 
  })
  const [catForm, setCatForm] = useState({ name: '' })
  const [editCatId, setEditCatId] = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // --- 1. CHECK LOGIN ON LOAD ---
  useEffect(() => {
    const savedAuth = localStorage.getItem('ma_admin_auth')
    if (savedAuth === 'true') setIsLoggedIn(true)
  }, [])

  // --- 2. FETCH DATA & START POLLING ---
  useEffect(() => {
    if (isLoggedIn) {
        refreshData(true) // Initial load
        
        // POLL FOR NEW ORDERS EVERY 10 SECONDS
        const interval = setInterval(() => {
            refreshData(false) // Silent refresh
        }, 10000)

        return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  // --- SOUND FUNCTION ---
  const triggerNewOrderAlarm = () => {
      if (audioRef.current) {
          setShowNewOrderAlert(true)
          audioRef.current.currentTime = 0
          audioRef.current.loop = true // Start looping
          audioRef.current.play().catch(e => console.log("Audio blocked", e))

          // Stop after 6 seconds
          setTimeout(() => {
              if(audioRef.current) {
                  audioRef.current.pause()
                  audioRef.current.loop = false
                  audioRef.current.currentTime = 0
              }
              setShowNewOrderAlert(false)
          }, 6000) 
      }
  }

  const refreshData = async (isInitialLoad = false) => {
    try {
      const prodRes = await fetch('/api/products')
      if (prodRes.ok) setProducts(await prodRes.json())

      const catRes = await fetch('/api/categories')
      if (catRes.ok) setCategories(await catRes.json())

      const galRes = await fetch('/api/gallery')
      if (galRes.ok) setGallery(await galRes.json())

      const msgRes = await fetch('/api/stats')
      if (msgRes.ok) {
        const data = await msgRes.json()
        setMessages(data.messages || [])
      }

      // ORDERS LOGIC
      const orderRes = await fetch('/api/orders')
      if (orderRes.ok) {
          const newOrders = await orderRes.json()
          setOrders(newOrders)
          
          // Check if new order arrived (count increased)
          if (!isInitialLoad && newOrders.length > prevOrderCountRef.current) {
              triggerNewOrderAlarm()
          }
          
          // Update ref for next check
          prevOrderCountRef.current = newOrders.length
      }

    } catch (err) { console.error('Error fetching data:', err) }
  }

  // --- AUTH ---
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setIsLoggedIn(true)
        localStorage.setItem('ma_admin_auth', 'true')
      }
      else setError('Mot de passe incorrect.')
    } catch (err) { setError('Erreur serveur.') }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('ma_admin_auth')
    window.location.reload()
  }

  // --- ORDERS ACTIONS ---
  const initiateDeleteOrder = (id: number) => {
    setOrderToDelete(id)
    setDeleteModalOpen(true)
  }

  const confirmDeleteOrder = async () => {
    if (orderToDelete) {
        await fetch(`/api/orders?id=${orderToDelete}`, { method: 'DELETE' })
        setDeleteModalOpen(false)
        setOrderToDelete(null)
        refreshData(true) // Reset count logic so alarm doesn't trigger on delete
    }
  }

  const toggleOrderStatus = async (order: any) => {
      const newStatus = order.status === 'En attente' ? 'Traité' : 'En attente'
      await fetch('/api/orders', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ id: order.id, status: newStatus })
      })
      refreshData(true)
  }

  // --- GALLERY CRUD ---
  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = async () => {
          await fetch('/api/gallery', {
            method: 'POST',
            body: JSON.stringify({ url: reader.result })
          })
          refreshData(true)
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const deleteGalleryImage = async (id: number) => {
    if (confirm('Supprimer cette photo ?')) {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' })
      refreshData(true)
    }
  }

  // --- CATEGORY CRUD ---
  const handleCategorySubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!catForm.name) return

    if (editCatId) {
      await fetch('/api/categories', {
        method: 'PUT',
        body: JSON.stringify({ id: editCatId, name: catForm.name })
      })
      setEditCatId(null)
    } else {
      await fetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: catForm.name })
      })
    }
    setCatForm({ name: '' })
    refreshData(true)
  }

  const deleteCategory = async (id: number) => {
    if (confirm('Supprimer cette catégorie ?')) {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      refreshData(true)
    }
  }

  // --- PRODUCT CRUD ---
  const handleProductImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => setProdForm(p => ({ ...p, images: [...p.images, reader.result as string] }))
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSubmitProduct = async (e: FormEvent) => {
    e.preventDefault()
    if (!prodForm.name || !prodForm.price) return alert('Champs manquants')

    const method = isEditing ? 'PUT' : 'POST'
    const body = isEditing ? { id: isEditing, ...prodForm } : prodForm

    await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!isEditing) {
      setProdForm({ name: '', price: '', stock: '10', category: '', brand: 'M.A Tradition', images: [] })
      if(fileInputRef.current) fileInputRef.current.value = ''
    }
    setIsEditing(null)
    refreshData(true)
    setActiveTab('products') 
  }

  const startEdit = (product: any) => {
    setIsEditing(product.id)
    setProdForm({ 
      name: product.name, 
      price: product.price.toString(), 
      stock: product.stock ? product.stock.toString() : '10',
      category: product.category, 
      brand: product.brand || 'M.A Tradition', 
      images: product.images || []
    })
    setActiveTab('add-product')
  }

  const deleteProduct = async (id: number) => {
    if(confirm('Supprimer ce produit ?')) {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
      refreshData(true)
    }
  }

  // --- LOGIN UI ---
  if (!isLoggedIn) {
    return (
      <div className="admin-wrapper login-mode">
        <style jsx global>{`
          .admin-wrapper, .admin-wrapper * { cursor: default !important; }
          .admin-wrapper a, .admin-wrapper button, .admin-wrapper .cursor-pointer { cursor: pointer !important; }
        `}</style>
        <div className="login-box">
          <div className="logo">M.A Admin</div>
          <p>Espace sécurisé</p>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <div className="error-msg">{error}</div>}
            <button disabled={loading}>{loading ? '...' : 'Connexion'}</button>
          </form>
        </div>
        <style jsx>{`
          .login-mode { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f3f4f6; }
          .login-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
          .logo { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 10px; }
          input { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 16px; font-size: 0.95rem; }
          button { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 500; transition: 0.2s; }
          button:hover { background: #1d4ed8; }
          .error-msg { color: #ef4444; font-size: 0.85rem; margin-bottom: 12px; }
        `}</style>
      </div>
    )
  }

  // --- DASHBOARD UI ---
  return (
    <div className="admin-wrapper dashboard-layout">
      {/* HIDDEN AUDIO ELEMENT */}
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" hidden />

      {/* NEW ORDER NOTIFICATION TOAST */}
      <div className={`new-order-toast ${showNewOrderAlert ? 'show' : ''}`}>
          <div className="bell-icon"><Icons.Bell /></div>
          <div>
              <strong>Nouvelle Commande !</strong>
              <div style={{fontSize:'0.85rem', opacity:0.9}}>Vérifiez l'onglet Commandes</div>
          </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .admin-wrapper { font-family: 'Inter', sans-serif; background: #f3f4f6; min-height: 100vh; display: flex; }
        .admin-wrapper * { cursor: default !important; box-sizing: border-box; }
        .admin-wrapper button, .admin-wrapper a, .admin-wrapper .clickable { cursor: pointer !important; }
      `}</style>

      <aside className="sidebar">
        <div className="brand">M.A <span style={{color:'#3b82f6'}}>Admin</span></div>
        <nav className="nav-menu">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><Icons.Dashboard /> Dashboard</button>
          
          <div className="nav-label">Commandes</div>
          <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}><Icons.Bag /> Commandes</button>

          <div className="nav-label">Gestion</div>
          <button className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}><Icons.List /> Catégories</button>
          <button className={`nav-item ${activeTab === 'add-product' ? 'active' : ''}`} onClick={() => { setIsEditing(null); setActiveTab('add-product'); }}><Icons.Plus /> Ajouter Produit</button>
          <button className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}><Icons.Product /> Liste Produits</button>
          <button className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}><Icons.Image /> Galerie</button>
          
          <div className="nav-label">Système</div>
          <button className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}><Icons.Mail /> Messages</button>
          <button className="nav-item logout" onClick={handleLogout}><Icons.Logout /> Déconnexion</button>
        </nav>
      </aside>

      <main className="content-area">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="fade-in">
            <h1 className="page-title">Vue d'ensemble</h1>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-label">Commandes</div><div className="stat-val">{orders.length}</div></div>
              <div className="stat-card"><div className="stat-label">Produits</div><div className="stat-val">{products.length}</div></div>
              <div className="stat-card"><div className="stat-label">Messages</div><div className="stat-val">{messages.length}</div></div>
            </div>
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
            <div className="fade-in">
                <h1 className="page-title">Commandes Clients</h1>
                <div className="card">
                    <table className="clean-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Client</th>
                                <th style={{width: '40%'}}>Articles</th>
                                <th>Total</th>
                                <th>Date</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>
                                        <div className="fw-600">{order.customer.split('|')[0]}</div>
                                        <div className="sub-text">{order.customer.split('|')[1]}</div>
                                    </td>
                                    <td>
                                        {/* JSON Parser for Items */}
                                        {(() => {
                                            try {
                                                const items = JSON.parse(order.item);
                                                return (
                                                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                                                        {items.map((i: any, idx: number) => (
                                                            <div key={idx} style={{display:'flex', alignItems:'center', gap:'12px'}}>
                                                                <img src={i.images && i.images[0] ? i.images[0] : '/placeholder.jpg'} style={{width:'40px', height:'40px', borderRadius:'4px', objectFit:'cover', border:'1px solid #eee'}} />
                                                                <span style={{fontSize:'0.9rem', color:'#374151'}}><strong>{i.quantity}x</strong> {i.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            } catch (e) { return <span>{order.item}</span> }
                                        })()}
                                    </td>
                                    <td className="fw-600">{order.total} TND</td>
                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge clickable ${order.status === 'Traité' ? 'success' : 'warning'}`} onClick={() => toggleOrderStatus(order)}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="icon-btn trash clickable" onClick={() => initiateDeleteOrder(order.id)}><Icons.Trash /></button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && <tr><td colSpan={7} style={{textAlign:'center', color:'#888'}}>Aucune commande trouvée.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* ... (Rest of Tabs: Gallery, Categories, etc. - KEPT SAME) ... */}
        {activeTab === 'gallery' && (
          <div className="fade-in">
            <h1 className="page-title">Gérer la Galerie</h1>
            <div className="card">
               <div className="upload-zone clickable" onClick={() => galleryInputRef.current?.click()} style={{marginBottom:'30px'}}>
                   <input type="file" hidden multiple ref={galleryInputRef} onChange={handleGalleryUpload} />
                   <div className="upload-icon"><Icons.Upload /></div>
                   <p>Ajouter des photos à la galerie</p>
                </div>
                <div className="gallery-grid-admin">
                  {gallery.map(img => (
                    <div key={img.id} className="gal-item"><img src={img.url} /><button className="del-btn clickable" onClick={() => deleteGalleryImage(img.id)}>🗑</button></div>
                  ))}
                </div>
            </div>
          </div>
        )}
        {activeTab === 'categories' && (
          <div className="fade-in">
            <h1 className="page-title">Gérer les Catégories</h1>
            <div className="card">
              <form onSubmit={handleCategorySubmit} className="flex-row">
                <input type="text" placeholder="Nouvelle Catégorie..." value={catForm.name} onChange={e => setCatForm({name: e.target.value})} className="input-simple"/>
                <button className="btn-primary clickable">{editCatId ? 'Modifier' : 'Ajouter'}</button>
                {editCatId && <button className="btn-secondary clickable" onClick={() => {setEditCatId(null); setCatForm({name:''})}}>Annuler</button>}
              </form>
              <table className="clean-table mt-6">
                <thead><tr><th>Nom</th><th>Actions</th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id}>
                      <td className="fw-600">{c.name}</td>
                      <td>
                        <div className="actions">
                          <button className="icon-btn edit clickable" onClick={() => {setEditCatId(c.id); setCatForm({name: c.name})}}><Icons.Edit /></button>
                          <button className="icon-btn trash clickable" onClick={() => deleteCategory(c.id)}><Icons.Trash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'add-product' && (
          <div className="fade-in">
            <h1 className="page-title">{isEditing ? 'Modifier Produit' : 'Ajouter un Produit'}</h1>
            <div className="split-form">
              <div className="form-left card">
                <h3 className="card-title">Photos</h3>
                <div className="upload-zone clickable" onClick={() => fileInputRef.current?.click()}>
                   <input type="file" hidden multiple ref={fileInputRef} onChange={handleProductImageUpload} />
                   <div className="upload-icon"><Icons.Upload /></div>
                   <p>Ajouter des photos</p>
                </div>
                <div className="preview-grid">
                  {prodForm.images.map((src, idx) => (<div key={idx} className="preview-item"><img src={src} /><button className="remove-btn clickable" onClick={() => setProdForm(p => ({...p, images: p.images.filter((_, i) => i !== idx)}))}>×</button></div>))}
                </div>
              </div>
              <div className="form-right card">
                <h3 className="card-title">Détails</h3>
                <div className="input-group"><label>Nom *</label><input type="text" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} /></div>
                <div className="row-2">
                  <div className="input-group"><label>Prix (TND) *</label><input type="number" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} placeholder="0.00" /></div>
                  <div className="input-group"><label>Quantité (Stock)</label><input type="number" value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: e.target.value})} placeholder="10" /></div>
                </div>
                <div className="input-group"><label>Marque</label><input type="text" value={prodForm.brand} onChange={e => setProdForm({...prodForm, brand: e.target.value})} /></div>
                <div className="input-group">
                  <label>Catégorie</label>
                  <select value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                    <option value="">Sélectionner...</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-actions">
                  {isEditing && <button className="btn-secondary clickable" onClick={() => {setIsEditing(null); setProdForm({name:'', price:'', stock: '10', category:'', brand:'M.A Tradition', images:[]})}}>Annuler</button>}
                  <button className="btn-primary clickable" onClick={handleSubmitProduct}>{isEditing ? 'Mettre à jour' : 'Publier'}</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'products' && (
          <div className="fade-in">
             <div className="flex-between"><h1 className="page-title">Produits</h1><button className="btn-primary clickable" onClick={() => {setIsEditing(null); setActiveTab('add-product');}}><Icons.Plus /> Nouveau</button></div>
             <div className="card mt-6">
               <table className="clean-table">
                 <thead><tr><th>Img</th><th>Nom</th><th>Cat</th><th>Prix</th><th>Stock</th><th>Actions</th></tr></thead>
                 <tbody>
                   {products.map(p => (
                     <tr key={p.id}>
                       <td><img src={p.images[0] || '/placeholder.jpg'} className="table-img" /></td>
                       <td className="fw-600">{p.name}</td>
                       <td><span className="badge bg-gray">{p.category}</span></td>
                       <td>{p.price} TND</td>
                       <td style={{fontWeight:'bold', color:'#2563eb'}}>{p.stock}</td>
                       <td><div className="actions"><button className="icon-btn edit clickable" onClick={() => startEdit(p)}><Icons.Edit /></button><button className="icon-btn trash clickable" onClick={() => deleteProduct(p.id)}><Icons.Trash /></button></div></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
        {activeTab === 'messages' && (
           <div className="fade-in">
             <h1 className="page-title">Messages</h1>
             <div className="card mt-6">
                <table className="clean-table">
                  <thead><tr><th>Client</th><th>Message</th><th>Date</th></tr></thead>
                  <tbody>{messages.map(m => (<tr key={m.id}><td><div className="fw-600">{m.name}</div><div className="sub-text">{m.email}</div></td><td style={{color:'#4b5563'}}>{m.msg}</td><td>{new Date(m.date).toLocaleDateString()}</td></tr>))}</tbody>
                </table>
             </div>
           </div>
        )}
      </main>

      {/* --- CUSTOM DELETE MODAL --- */}
      {deleteModalOpen && (
        <div className="modal-overlay">
            <div className="modal-box">
                <div className="modal-icon-wrapper">
                    <Icons.Alert />
                </div>
                <h3 className="modal-title">Supprimer cette commande ?</h3>
                <p className="modal-desc">Cette action est irréversible. La commande sera définitivement supprimée de la base de données.</p>
                <div className="modal-actions">
                    <button className="btn-modal btn-cancel" onClick={() => setDeleteModalOpen(false)}>Annuler</button>
                    <button className="btn-modal btn-confirm" onClick={confirmDeleteOrder}>Supprimer</button>
                </div>
            </div>
        </div>
      )}

      <style jsx>{`
        /* EXISTING STYLES */
        .sidebar { width: 260px; background: white; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; position: fixed; height: 100vh; padding: 24px; z-index: 50; }
        .brand { font-size: 1.25rem; font-weight: 800; color: #111827; margin-bottom: 32px; padding-left: 12px; }
        .nav-menu { flex: 1; }
        .nav-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #9ca3af; margin: 24px 0 8px 12px; }
        .nav-item { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 12px; border: none; background: transparent; color: #4b5563; font-weight: 500; font-size: 0.95rem; border-radius: 8px; transition: 0.2s; text-align: left; }
        .nav-item:hover { background: #f3f4f6; color: #111827; }
        .nav-item.active { background: #eff6ff; color: #2563eb; font-weight: 600; }
        .nav-item.logout { color: #ef4444; } .nav-item.logout:hover { background: #fef2f2; }
        .content-area { margin-left: 260px; flex: 1; padding: 40px; max-width: 1400px; }
        .page-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 24px; }
        .card { background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(0,0,0,0.05); padding: 24px; }
        .card-title { font-size: 1.1rem; font-weight: 600; color: #111827; margin-bottom: 20px; }
        .mt-6 { margin-top: 24px; }
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .stat-card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .stat-label { color: #6b7280; font-size: 0.875rem; font-weight: 500; }
        .stat-val { font-size: 1.875rem; font-weight: 700; color: #111827; margin-top: 8px; }
        .flex-row { display: flex; gap: 10px; }
        .input-simple { flex: 1; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; }
        .split-form { display: grid; grid-template-columns: 350px 1fr; gap: 24px; align-items: start; }
        .input-group { margin-bottom: 16px; }
        .input-group label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 6px; }
        .input-group input, .input-group select { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.95rem; background: #fff; }
        .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-actions { margin-top: 24px; text-align: right; }
        .upload-zone { border: 2px dashed #e5e7eb; border-radius: 8px; padding: 32px; text-align: center; transition: 0.2s; background: #f9fafb; cursor: pointer; }
        .upload-zone:hover { border-color: #3b82f6; background: #eff6ff; }
        .preview-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
        .preview-item { position: relative; aspect-ratio: 1; border-radius: 6px; overflow: hidden; border: 1px solid #e5e7eb; }
        .preview-item img { width: 100%; height: 100%; object-fit: cover; }
        .remove-btn { position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .gallery-grid-admin { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
        .gal-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid #eee; }
        .gal-item img { width: 100%; height: 100%; object-fit: cover; }
        .del-btn { position: absolute; bottom: 5px; right: 5px; background: white; border: 1px solid #eee; padding: 5px; border-radius: 4px; cursor: pointer; }
        .clean-table { width: 100%; border-collapse: collapse; }
        .clean-table th { text-align: left; padding: 12px 16px; font-size: 0.75rem; text-transform: uppercase; color: #6b7280; font-weight: 600; border-bottom: 1px solid #e5e7eb; }
        .clean-table td { padding: 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; color: #374151; font-size: 0.95rem; }
        .table-img { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; border: 1px solid #e5e7eb; }
        .fw-600 { font-weight: 600; color: #111827; }
        .sub-text { font-size: 0.8rem; color: #6b7280; }
        .badge { padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .bg-gray { background: #f3f4f6; color: #374151; }
        .status-badge { padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: inline-block; }
        .status-badge.warning { background: #fef3c7; color: #d97706; }
        .status-badge.success { background: #d1fae5; color: #059669; }
        .actions { display: flex; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 1px solid transparent; transition: 0.2s; }
        .icon-btn.edit { background: #eff6ff; color: #2563eb; } .icon-btn.edit:hover { border-color: #2563eb; }
        .icon-btn.trash { background: #fef2f2; color: #ef4444; } .icon-btn.trash:hover { border-color: #ef4444; }
        .btn-primary { background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; font-weight: 500; border: none; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-secondary { background: white; color: #374151; padding: 10px 20px; border-radius: 6px; font-weight: 500; border: 1px solid #d1d5db; margin-right: 12px; transition: 0.2s; }
        .btn-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }

        /* --- NEW MODAL STYLES --- */
        .modal-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
            z-index: 10000; display: flex; align-items: center; justify-content: center;
            animation: fadeIn 0.2s ease-out;
        }
        .modal-box {
            background: white; width: 100%; max-width: 400px; padding: 24px; border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            text-align: center; animation: scaleIn 0.2s ease-out;
        }
        .modal-icon-wrapper {
            background: #fef2f2; width: 60px; height: 60px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
        }
        .modal-title { font-size: 1.25rem; font-weight: 700; color: #111827; margin-bottom: 8px; }
        .modal-desc { color: #6b7280; font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px; }
        .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .btn-modal { padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: 0.2s; }
        .btn-cancel { background: white; border-color: #d1d5db; color: #374151; }
        .btn-cancel:hover { background: #f9fafb; }
        .btn-confirm { background: #ef4444; color: white; }
        .btn-confirm:hover { background: #dc2626; }

        /* --- NEW ORDER ALERT TOAST --- */
        .new-order-toast {
            position: fixed; top: 20px; right: 20px;
            background: #2563eb; color: white;
            padding: 16px 20px; border-radius: 12px;
            display: flex; align-items: center; gap: 12px;
            box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
            transform: translateX(200%); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 11000; pointer-events: none;
        }
        .new-order-toast.show { transform: translateX(0); }
        .bell-icon {
            background: rgba(255,255,255,0.2); width: 40px; height: 40px;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            animation: ring 1s infinite ease-in-out;
        }
        @keyframes ring {
            0% { transform: rotate(0); } 10% { transform: rotate(15deg); } 20% { transform: rotate(-15deg); }
            30% { transform: rotate(10deg); } 40% { transform: rotate(-10deg); } 100% { transform: rotate(0); }
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  )
}