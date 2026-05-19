import { useState, useEffect } from 'react'
import { useAuth } from '../store/useAuth'
import api from '../api/client'
import { User, Phone, MapPin, Trash2, Plus, CheckCircle, AlertCircle, Save, ShoppingBag, Truck, PackageCheck, RefreshCw, CreditCard, Search, Download, Camera } from 'lucide-react'

export default function Profile() {
  const { user, updateProfile, loading, error, setUser } = useAuth()
  
  // Basic info state
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')

  // Addresses list state
  const [addresses, setAddresses] = useState(user?.addresses || [])
  
  // Address form state
  const [newLabel, setNewLabel] = useState('Home')
  const [newStreet, setNewStreet] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newZip, setNewZip] = useState('')

  // Orders list state
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')

  const [message, setMessage] = useState('')
  const [localError, setLocalError] = useState('')
  const [avatarLoading, setAvatarLoading] = useState(false)

  // Order search state
  const [orderSearch, setOrderSearch] = useState('')

  const filteredOrders = orders.filter((order) => {
    const idMatch = String(order.id).includes(orderSearch)
    const titleMatch = (order.product?.title || '').toLowerCase().includes(orderSearch.toLowerCase())
    return idMatch || titleMatch
  })

  const downloadReceipt = (order) => {
    const invoiceNum = `INV-${new Date(order.created_at).getFullYear()}-${order.id}`
    const invoiceText = `=========================================
      LEATHERCRAFT MARKETPLACE INVOICE
=========================================
Invoice Number:   ${invoiceNum}
Date Issued:      ${new Date(order.created_at).toLocaleString()}
Payment Status:   PAID (Stripe Card Billing)

-----------------------------------------
CUSTOMER DETAILS:
Name:             ${user.name}
Email:            ${user.email}
Phone:            ${user.phone || 'N/A'}

-----------------------------------------
PRODUCT DESCRIPTION:
Item:             ${order.product?.title || 'Bespoke Custom Leather Product'}
Total Quantity:   1
Unit Price:       ₹${order.amount}

-----------------------------------------
BILLING SUMMARY:
Subtotal:         ₹${order.amount}
Tax / GST (0%):   ₹0.00
Platform Fees:    ₹0.00
-----------------------------------------
TOTAL AMOUNT:     ₹${order.amount}
=========================================
Thank you for supporting hand-crafted leathers!
For support, contact: support@leathercraft.com
=========================================
`
    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `LeatherCraft_Invoice_${invoiceNum}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Load orders on mount
  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get('/payments/orders')
        setOrders(response.data.orders || [])
      } catch (err) {
        console.error('Failed to load customer orders:', err)
      } finally {
        setOrdersLoading(false)
      }
    }
    loadOrders()
  }, [])

  // Add a new address block locally
  const handleAddAddress = (e) => {
    e.preventDefault()
    setLocalError('')

    if (!newStreet || !newCity || !newZip) {
      setLocalError('Please complete all address fields before adding.')
      return
    }

    const newAddr = {
      id: Date.now(),
      label: newLabel,
      street: newStreet,
      city: newCity,
      zip: newZip
    }

    setAddresses([...addresses, newAddr])
    
    // Reset form
    setNewStreet('')
    setNewCity('')
    setNewZip('')
  }

  // Delete address
  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id))
  }

  // Save changes
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setMessage('')
    setLocalError('')

    if (!name || !email) {
      setLocalError('Name and email are required.')
      return
    }

    const payload = {
      name,
      email,
      phone,
      addresses
    }

    const success = await updateProfile(payload)
    if (success) {
      setMessage('Your account details were updated successfully!')
      setTimeout(() => setMessage(''), 4000)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setAvatarLoading(true)
    setLocalError('')
    setMessage('')

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const { data } = await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setMessage('Profile image updated successfully.')
      setUser(data.user)
    } catch (err) {
      setLocalError(err.response?.data?.message || err.message || 'Failed to upload profile image.')
    } finally {
      setAvatarLoading(false)
    }
  }

  const handleDeleteAvatar = async () => {
    setAvatarLoading(true)
    setLocalError('')
    setMessage('')

    try {
      const { data } = await api.delete('/user/avatar')
      setMessage('Profile image removed successfully.')
      setUser(data.user)
    } catch (err) {
      setLocalError(err.response?.data?.message || err.message || 'Failed to remove profile image.')
    } finally {
      setAvatarLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-walnut/60">
        Please log in to view your account details.
      </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-olive/10 border border-olive/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-olive">
            <Truck size={12} />
            Shipped & In Transit
          </span>
        )
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            <PackageCheck size={12} />
            Delivered Successfully
          </span>
        )
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <RefreshCw size={12} className="animate-spin" />
            Processing Order
          </span>
        )
      case 'confirmed':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-terracotta/10 border border-terracotta/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-terracotta">
            <ShoppingBag size={12} />
            Order Confirmed
          </span>
        )
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-in fade-in duration-500 mt-6 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white p-6 rounded-3xl border border-sand shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-terracotta/5 rounded-full filter blur-3xl -z-0"></div>
        <div className="relative group flex h-20 w-20 items-center justify-center rounded-full bg-walnut text-ivory shadow-md border border-sand/40 overflow-hidden cursor-pointer flex-shrink-0">
          {avatarLoading ? (
            <span className="h-6 w-6 border-2 border-ivory border-t-transparent rounded-full animate-spin"></span>
          ) : user?.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <User size={32} />
          )}
          <label className="absolute inset-0 bg-walnut/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
            <Camera size={18} className="text-white" />
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>
        <div className="flex-1 relative z-10">
          <h1 className="text-2xl font-serif font-black text-walnut tracking-tight">Account Details</h1>
          <p className="text-xs text-walnut/50 mt-1 font-semibold">Manage your contact information and delivery addresses.</p>
          {user?.avatar_url && (
            <button
              type="button"
              onClick={handleDeleteAvatar}
              disabled={avatarLoading}
              className="mt-2 inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-rose-600 hover:text-rose-700 transition"
            >
              <Trash2 size={10} /> Remove Profile Image
            </button>
          )}
        </div>
      </div>

      {(message || error || localError) && (
        <div className="max-w-6xl mx-auto">
          {message && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}
          {(error || localError) && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
              <span>{localError || error}</span>
            </div>
          )}
        </div>
      )}

      {/* Profile Details Grid */}
      <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto">
        {/* Left Side: General Profile Info */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleSaveProfile} className="rounded-3xl border border-sand bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-walnut uppercase tracking-widest border-b border-sand/30 pb-3 flex items-center gap-1.5">
              <User size={16} className="text-terracotta" />
              Personal Info
            </h2>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50 flex items-center gap-1">
                <Phone size={10} /> Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-walnut hover:bg-walnut/90 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-sm disabled:opacity-50"
              >
                <Save size={14} />
                {loading ? 'Saving Profile...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Multiple Delivery Addresses */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-walnut uppercase tracking-widest border-b border-sand/30 pb-3 flex items-center gap-1.5">
              <MapPin size={16} className="text-olive" />
              Delivery Addresses
            </h2>

            {/* Existing Addresses List */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-2xl border border-sand bg-ivory p-4 flex items-start justify-between gap-4 text-xs font-semibold text-walnut/70"
                >
                  <div className="space-y-1">
                    <span className="inline-block bg-walnut/10 text-walnut text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-walnut/20">
                      {addr.label}
                    </span>
                    <p className="text-walnut font-bold text-xs pt-1">{addr.street}</p>
                    <p className="text-[10px] text-walnut/50">{addr.city} - {addr.zip}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center border border-rose-100 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              {addresses.length === 0 && (
                <div className="text-center py-6 border border-dashed border-sand/60 rounded-2xl text-walnut/40 font-semibold text-[11px] leading-relaxed">
                  No addresses saved yet. <br /> Use the form below to add one.
                </div>
              )}
            </div>

            {/* Add New Address Form */}
            <div className="border-t border-sand/30 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-walnut uppercase tracking-wider">Add New Address</h3>
              
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/40">Address Label</label>
                  <select
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2 text-xs font-bold text-walnut outline-none"
                  >
                    <option value="Home">Home Address</option>
                    <option value="Office">Office / Work</option>
                    <option value="Other">Other Address</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/40">Street Address</label>
                  <input
                    type="text"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="Flat No, Building, Street Name"
                    className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none text-walnut"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/40">City / State</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none text-walnut"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/40">ZIP Code</label>
                  <input
                    type="text"
                    value={newZip}
                    onChange={(e) => setNewZip(e.target.value)}
                    placeholder="e.g. 560001"
                    className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none text-walnut"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddAddress}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-sand bg-ivory hover:bg-sand/15 py-2.5 text-xs font-bold uppercase tracking-wider text-walnut transition-all"
              >
                <Plus size={13} />
                Add Address Block
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: My Orders & Payment History Tabs */}
      <section className="rounded-3xl border border-sand bg-white p-6 shadow-sm space-y-6">
        <div className="border-b border-sand/30 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-1 text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === 'orders'
                  ? 'border-b-2 border-terracotta text-terracotta'
                  : 'text-walnut/40 hover:text-walnut/60'
              }`}
            >
              My Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`pb-1 text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === 'payments'
                  ? 'border-b-2 border-terracotta text-terracotta'
                  : 'text-walnut/40 hover:text-walnut/60'
              }`}
            >
              Payment History
            </button>
          </div>
        </div>

        {/* Live Search & Filter Bar */}
        {!ordersLoading && orders.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-ivory/50 border border-sand/40 p-4 rounded-2xl shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-walnut/40" />
              <input
                type="text"
                placeholder="Search orders by ID or product title..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-sand bg-white rounded-xl text-xs font-semibold text-walnut focus:border-terracotta outline-none transition-all"
              />
            </div>
            <span className="text-[10px] text-walnut/40 font-bold uppercase tracking-wider">
              {filteredOrders.length} of {orders.length} transaction records
            </span>
          </div>
        )}

        {ordersLoading ? (
          <div className="py-6 text-center text-xs font-semibold text-walnut/40">
            Loading active transactions...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-xs font-semibold text-walnut/40 max-w-sm mx-auto space-y-2">
            <ShoppingBag size={28} className="text-sand mx-auto" />
            <p>No transactions matching your search filters.</p>
          </div>
        ) : activeTab === 'orders' ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-sand bg-ivory/30 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs font-semibold"
              >
                {/* Left side: design preview and title */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-white border border-sand/30 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                    <img
                      src={order.product?.image}
                      alt={order.product?.title}
                      className="h-full w-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-walnut/40 font-bold">Order #{order.id}</span>
                    <h3 className="text-sm font-bold text-walnut">{order.product?.title || 'Printed Leather Item'}</h3>
                    <p className="text-[10px] text-walnut/50">Purchased on {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                {/* Right side: price and current status */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-sand/20 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="block text-[8px] uppercase tracking-widest text-walnut/40 mb-0.5">Amount Paid</span>
                    <span className="text-sm font-black text-terracotta">₹{order.amount}</span>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(order.status)}
                    <button
                      onClick={() => downloadReceipt(order)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-walnut hover:bg-walnut/90 border border-transparent px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Download size={10} className="text-sand" /> Invoice Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Payment History Table */
          <div className="overflow-x-auto rounded-2xl border border-sand bg-ivory/20">
            <table className="w-full text-left text-xs text-walnut/80">
              <thead className="bg-sand/10 text-[9px] font-bold uppercase tracking-wider text-walnut/50 border-b border-sand/20">
                <tr>
                  <th className="px-6 py-3.5">Invoice Number</th>
                  <th className="px-6 py-3.5">Payment Method</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Payment Status</th>
                  <th className="px-6 py-3.5">Transaction Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/20 bg-white font-semibold">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-sand/5 transition-colors">
                    <td className="px-6 py-4 text-walnut font-bold">
                      INV-{new Date(order.created_at).getFullYear()}-{order.id}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-1.5 text-walnut/70">
                      <CreditCard size={13} className="text-walnut/50" />
                      Stripe Card Billing
                    </td>
                    <td className="px-6 py-4 text-terracotta font-black">₹{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                        Paid successfully
                      </span>
                    </td>
                    <td className="px-6 py-4 text-walnut/40">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => downloadReceipt(order)}
                        className="inline-flex items-center gap-1 rounded-lg bg-walnut hover:bg-walnut/90 border border-transparent px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-sm hover:shadow transition-all cursor-pointer"
                      >
                        <Download size={10} className="text-sand" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
