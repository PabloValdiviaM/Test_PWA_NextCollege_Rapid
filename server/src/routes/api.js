const express = require('express');
const router = express.Router();
const db = require('../db');

// Health Check Endpoint (Useful for Dokploy Health Checks)
router.get('/health', (req, res) => {
  const dbStatus = db.getDbStatus();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    platform: 'Dokploy CI/CD Live Demo',
    database: dbStatus
  });
});

// List products
router.get('/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new product
router.post('/products', async (req, res) => {
  try {
    const { name, category, price, stock, image, description } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: 'Nombre y precio son requeridos.' });
    }
    const product = await db.addProduct({ name, category, price, stock, image, description });
    res.status(201).json({ success: true, message: 'Producto creado exitosamente', data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteProduct(id);
    res.json({ success: true, message: `Producto ${id} eliminado.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset initial products
router.post('/reset', async (req, res) => {
  try {
    await db.resetProducts();
    res.json({ success: true, message: 'Datos demo restablecidos.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Diagnostic network endpoint to inspect container IP, subnets, and DNS resolution
const dns = require('dns').promises;
const os = require('os');
const net = require('net');

function checkTcpPort(host, port = 3306, timeout = 400) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.once('connect', () => {
      socket.destroy();
      resolve({ host, port, open: true });
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve({ host, port, open: false, reason: 'timeout' });
    });
    socket.once('error', (err) => {
      resolve({ host, port, open: false, reason: err.code || err.message });
    });
    socket.connect(port, host);
  });
}

router.get('/debug-network', async (req, res) => {
  const hostsToTest = [
    process.env.DB_HOST,
    'mysql-nextcollege-melsbz',
    'mysql-democicdecommerce-zm7fbw',
    '172.18.0.1',
    '172.17.0.1',
    '127.0.0.1'
  ].filter(Boolean);

  const dnsResults = {};
  for (const host of hostsToTest) {
    try {
      const lookup = await dns.lookup(host);
      dnsResults[host] = { ok: true, ip: lookup.address };
    } catch (err) {
      dnsResults[host] = { ok: false, error: err.message };
    }
  }

  // Scan key candidate IPs on port 3306
  const candidateTargets = ['172.18.0.1', '172.17.0.1'];
  if (dnsResults['mysql-democicdecommerce-zm7fbw']?.ip) {
    // Add neighbor IPs in 10.0.1.x
    for (let i = 1; i <= 254; i++) {
      candidateTargets.push(`10.0.1.${i}`);
    }
  }

  const portScans = await Promise.all(candidateTargets.map(ip => checkTcpPort(ip, 3306, 300)));
  const open3306 = portScans.filter(p => p.open);

  res.json({
    hostname: os.hostname(),
    interfaces: os.networkInterfaces(),
    environment: {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      HAS_PASSWORD: !!process.env.DB_PASSWORD,
      HAS_DATABASE_URL: !!process.env.DATABASE_URL
    },
    dns_tests: dnsResults,
    open_mysql_ports_found: open3306,
    db_status: db.getDbStatus()
  });
});

module.exports = router;

