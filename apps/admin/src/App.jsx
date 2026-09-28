import React, { useState, useEffect } from 'react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Computadoras',
    price: '',
    stock: '10',
    image: '',
    description: ''
  });
  const [serverHealth, setServerHealth] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.data) setProducts(data.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setServerHealth(data);
    } catch (err) {
      console.error('Error fetching health:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchHealth();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Por favor ingresa nombre y precio.');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setNewProduct({
          name: '',
          category: 'Computadoras',
          price: '',
          stock: '10',
          image: '',
          description: ''
        });
        fetchProducts();
      }
    } catch (err) {
      alert('Error al crear producto: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      alert('Error eliminando producto');
    }
  };

  const handleResetDemo = async () => {
    if (!confirm('¿Restablecer el catálogo con los datos iniciales?')) return;
    try {
      await fetch('/api/reset', { method: 'POST' });
      fetchProducts();
    } catch (err) {
      alert('Error restableciendo demo');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0f19' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: '#111827',
        borderRight: '1px solid #1f2937',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px' }}>
          <span style={{ fontSize: '1.6rem' }}>⚙️</span>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', margin: 0 }}>
              NextCollege <span style={{ color: '#38bdf8' }}>Admin</span>
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Control Panel v1.0</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <div style={{
            background: '#1f2937',
            color: 'white',
            padding: '10px 14px',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📊</span> Dashboard
          </div>
          <div style={{
            color: '#9ca3af',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📦</span> Productos ({products.length})
          </div>
          <div style={{
            color: '#9ca3af',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🚀</span> Dokploy CI/CD
          </div>
        </nav>

        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href="/"
            style={{
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px'
            }}
          >
            <span>🌐</span> Ver E-commerce
          </a>
          <a
            href="/app"
            style={{
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px'
            }}
          >
            <span>📱</span> Ver PWA Mobile
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', margin: 0 }}>
              Panel de Administración
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
              Gestión centralizada de catálogo sincronizada con Dokploy CI/CD y MySQL
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleResetDemo}
              style={{
                background: '#1f2937',
                border: '1px solid #374151',
                color: '#e5e7eb',
                padding: '9px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              🔄 Restablecer Demo
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: '#2563eb',
                border: 'none',
                color: 'white',
                padding: '9px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              + Nuevo Producto
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '32px' }}>
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: '600' }}>Ventas Totales Hoy</div>
            <div style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800', marginTop: '6px' }}>$14,290.00</div>
            <div style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '4px' }}>↑ +18.4% vs ayer</div>
          </div>

          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: '600' }}>Pedidos Activos</div>
            <div style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800', marginTop: '6px' }}>38</div>
            <div style={{ color: '#38bdf8', fontSize: '0.75rem', marginTop: '4px' }}>12 en preparación</div>
          </div>

          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: '600' }}>Catálogo Activo</div>
            <div style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800', marginTop: '6px' }}>{products.length}</div>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '4px' }}>Sincronizados en API</div>
          </div>

          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: '600' }}>Base de Datos</div>
            <div style={{ color: '#10b981', fontSize: '1.4rem', fontWeight: '800', marginTop: '6px' }}>
              {serverHealth?.database?.mode === 'mysql' ? '🐬 MySQL' : '⚡ In-Memory'}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={serverHealth?.database?.error || ''}>
              {serverHealth?.database?.error ? `⚠️ ${serverHealth.database.error}` : `Host: ${serverHealth?.database?.host || 'Auto'}`}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'white', margin: 0 }}>
              Gestión de Productos
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{products.length} registros</span>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Cargando catálogo...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#172033', color: '#9ca3af', borderBottom: '1px solid #1f2937' }}>
                  <th style={{ padding: '12px 20px' }}>Producto</th>
                  <th style={{ padding: '12px 20px' }}>Categoría</th>
                  <th style={{ padding: '12px 20px' }}>Precio</th>
                  <th style={{ padding: '12px 20px' }}>Stock</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #1f2937', color: '#e5e7eb' }}>
                    <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: 'white' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.description}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ background: '#1e293b', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: '700', color: 'white' }}>
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ color: p.stock > 15 ? '#10b981' : '#f59e0b', fontWeight: '600' }}>
                        {p.stock} uds.
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.8rem'
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal Agregar Producto */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '800', marginBottom: '18px' }}>
              Crear Nuevo Producto (Demo en Vivo)
            </h3>
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Mouse Inalámbrico Pro"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: '6px', padding: '10px', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Categoría</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: '6px', padding: '10px', color: 'white' }}
                  >
                    <option value="Computadoras">Computadoras</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="49.99"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: '6px', padding: '10px', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>URL de Imagen (opcional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: '6px', padding: '10px', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Descripción</label>
                <textarea
                  rows="2"
                  placeholder="Detalles del producto..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: '6px', padding: '10px', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: 'transparent', border: '1px solid #374151', color: '#9ca3af', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563eb', border: 'none', color: 'white', padding: '8px 20px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
