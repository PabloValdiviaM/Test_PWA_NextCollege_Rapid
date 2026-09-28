const mysql = require('mysql2/promise');

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'NextCollege Pro Laptop 15"',
    category: 'Computadoras',
    price: 1199.99,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60',
    description: 'Portátil de alto rendimiento optimizado para desarrollo de software e inteligencia artificial.'
  },
  {
    id: 2,
    name: 'Auriculares Noise-Cancelling ANC',
    category: 'Audio',
    price: 189.50,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    description: 'Cancelación activa de ruido para sesiones de programación sin distracciones.'
  },
  {
    id: 3,
    name: 'Smartwatch NextTrack Series X',
    category: 'Wearables',
    price: 249.00,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    description: 'Monitorización de salud y notificaciones push sincronizadas en tiempo real.'
  },
  {
    id: 4,
    name: 'Teclado Mecánico RGB Hot-Swap',
    category: 'Accesorios',
    price: 99.90,
    stock: 58,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    description: 'Switches mecánicos táctiles de respuesta ultrarrápida con retroiluminación personalizable.'
  }
];

let inMemoryProducts = [...INITIAL_PRODUCTS];
let pool = null;
let isConnectedToMySQL = false;

async function initDB() {
  const host = process.env.DB_HOST || process.env.MYSQL_HOST;
  const user = process.env.DB_USER || process.env.MYSQL_USER || 'root';
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'app_db';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  if (!host) {
    console.log('ℹ️ [DB] DB_HOST no configurado. Operando en modo In-Memory para demostración.');
    return;
  }

  try {
    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log(`✅ [DB] Conectado exitosamente a MySQL en ${host}:${port}/${database}`);

    // Create table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        image VARCHAR(500),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check count and seed if empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      console.log('🌱 [DB] Inicializando datos demo en la tabla products...');
      for (const p of INITIAL_PRODUCTS) {
        await connection.query(
          'INSERT INTO products (name, category, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?)',
          [p.name, p.category, p.price, p.stock, p.image, p.description]
        );
      }
    }

    connection.release();
    isConnectedToMySQL = true;
  } catch (error) {
    console.warn(`⚠️ [DB] No se pudo conectar a MySQL (${error.message}). Utilizando modo In-Memory temporal para no interrumpir la demo.`);
    isConnectedToMySQL = false;
  }
}

async function getProducts() {
  if (isConnectedToMySQL && pool) {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
    return rows;
  }
  return inMemoryProducts;
}

async function addProduct({ name, category, price, stock, image, description }) {
  if (isConnectedToMySQL && pool) {
    const [result] = await pool.query(
      'INSERT INTO products (name, category, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category, parseFloat(price) || 0, parseInt(stock, 10) || 0, image || '', description || '']
    );
    return { id: result.insertId, name, category, price: parseFloat(price) || 0, stock: parseInt(stock, 10) || 0, image, description };
  }

  const newProduct = {
    id: Date.now(),
    name,
    category: category || 'General',
    price: parseFloat(price) || 0,
    stock: parseInt(stock, 10) || 0,
    image: image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60',
    description: description || 'Producto agregado durante la demo en vivo.'
  };
  inMemoryProducts.unshift(newProduct);
  return newProduct;
}

async function deleteProduct(id) {
  const numId = parseInt(id, 10);
  if (isConnectedToMySQL && pool) {
    await pool.query('DELETE FROM products WHERE id = ?', [numId]);
    return true;
  }
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== numId);
  return true;
}

async function resetProducts() {
  if (isConnectedToMySQL && pool) {
    await pool.query('TRUNCATE TABLE products');
    for (const p of INITIAL_PRODUCTS) {
      await pool.query(
        'INSERT INTO products (name, category, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?)',
        [p.name, p.category, p.price, p.stock, p.image, p.description]
      );
    }
    return;
  }
  inMemoryProducts = [...INITIAL_PRODUCTS];
}

function getDbStatus() {
  return {
    mode: isConnectedToMySQL ? 'mysql' : 'in-memory',
    connected: isConnectedToMySQL,
    host: process.env.DB_HOST || 'local/in-memory'
  };
}

module.exports = {
  initDB,
  getProducts,
  addProduct,
  deleteProduct,
  resetProducts,
  getDbStatus
};
