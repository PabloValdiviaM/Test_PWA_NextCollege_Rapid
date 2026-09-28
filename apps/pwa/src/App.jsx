import React, { useState, useEffect } from 'react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [tab, setTab] = useState('catalog'); // 'catalog' | 'cart' | 'cicd'
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for PWA installation prompt
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.data) {
        setProducts(json.data);
      }
    } catch (err) {
      console.warn('Usando catálogo local/offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Para instalar esta PWA: En Safari pulsa "Compartir > Agregar a pantalla de inicio" o en Chrome selecciona "Instalar aplicación".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA Prompt outcome: ${outcome}`);
    setDeferredPrompt(null);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    showToast(`🛒 "${product.name}" agregado`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#2563eb',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '30px',
          zIndex: 9999,
          fontWeight: '600',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          fontSize: '0.9rem'
        }}>
          {toast}
        </div>
      )}

      {/* Top Mobile Bar */}
      <header style={{
        padding: '16px',
        background: '#131b2e',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>📱</span>
            <h1 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'white', margin: 0 }}>
              NextCollege <span style={{ color: '#38bdf8' }}>Mobile</span>
            </h1>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PWA Demo en Vivo</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.75rem',
            padding: '3px 8px',
            borderRadius: '12px',
            fontWeight: '600',
            background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isOnline ? '#10b981' : '#ef4444'
          }}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>
      </header>

      {/* Install Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #1e3a8a, #2563eb)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem'
      }}>
        <span>📲 Instala esta app en tu pantalla</span>
        <button
          onClick={handleInstallClick}
          style={{
            background: 'white',
            color: '#1e3a8a',
            border: 'none',
            padding: '5px 12px',
            borderRadius: '6px',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          Instalar
        </button>
      </div>

      {/* Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '90px' }}>
        {tab === 'catalog' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>Catálogo Móvil</h2>
              <button
                onClick={fetchProducts}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                🔄 Actualizar
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                Cargando productos sincronizados...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {products.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: '#131b2e',
                      border: '1px solid #1e293b',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '105px', height: '105px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: '700' }}>{p.category}</span>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'white', margin: '2px 0 6px 0' }}>
                        {p.name}
                      </h3>
                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>
                          ${Number(p.price).toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(p)}
                          style={{
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          + Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'cart' && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '16px' }}>
              Tu Carrito ({cart.length})
            </h2>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
                <span style={{ fontSize: '3rem' }}>🛒</span>
                <p style={{ marginTop: '12px' }}>Tu carrito está vacío.</p>
                <button
                  onClick={() => setTab('catalog')}
                  style={{
                    marginTop: '16px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#131b2e',
                        padding: '12px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid #1e293b'
                      }}
                    >
                      <div>
                        <div style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>${Number(item.price).toFixed(2)}</div>
                      </div>
                      <button
                        onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '24px', background: '#131b2e', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <span>Subtotal:</span>
                    <span>${cart.reduce((acc, curr) => acc + Number(curr.price), 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: '800', fontSize: '1.2rem', marginTop: '8px' }}>
                    <span>Total:</span>
                    <span>${cart.reduce((acc, curr) => acc + Number(curr.price), 0).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      alert('¡Pedido procesado con éxito!');
                      setCart([]);
                      setTab('catalog');
                    }}
                    style={{
                      width: '100%',
                      marginTop: '16px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    Confirmar Pedido 🚀
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'cicd' && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '16px' }}>
              Estado Dokploy & CI/CD
            </h2>

            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>🚀</span>
                <div>
                  <div style={{ fontWeight: '700', color: 'white' }}>Dokploy Auto-Deploy</div>
                  <div style={{ fontSize: '0.8rem', color: '#10b981' }}>🟢 Activo & Monitoreando GitHub</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4' }}>
                Cualquier cambio enviado con <code>git push origin main</code> activa el webhook de Dokploy, construyendo la imagen Docker multi-stage y actualizando las 3 capas sin tiempo de inactividad.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href="/"
                style={{
                  background: '#1e293b',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>🌐 Ir al Portal E-commerce</span>
                <span>&rarr;</span>
              </a>
              <a
                href="/admin"
                style={{
                  background: '#1e293b',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>⚙️ Ir al Panel Administrativo</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        maxWidth: '480px',
        background: '#131b2e',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        zIndex: 100
      }}>
        <button
          onClick={() => setTab('catalog')}
          style={{
            background: 'none',
            border: 'none',
            color: tab === 'catalog' ? '#38bdf8' : '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🛍️</span>
          <span>Catálogo</span>
        </button>

        <button
          onClick={() => setTab('cart')}
          style={{
            background: 'none',
            border: 'none',
            color: tab === 'cart' ? '#38bdf8' : '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🛒</span>
          <span>Carrito</span>
          {cart.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '8px',
              background: '#ef4444',
              color: 'white',
              fontSize: '0.65rem',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {cart.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab('cicd')}
          style={{
            background: 'none',
            border: 'none',
            color: tab === 'cicd' ? '#38bdf8' : '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🚀</span>
          <span>CI/CD</span>
        </button>
      </nav>
    </div>
  );
}
