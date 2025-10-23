const express = require('express');
const fs = require('fs'); // File System module
const app = express();
const port = 3000;

const DB_FILE = './items.json';

// Middleware untuk membaca JSON body dari request
app.use(express.json());

// === Helper Functions ===
// Fungsi untuk membaca data dari file JSON
const readData = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // Jika file tidak ada, kembalikan array kosong
    return [];
  }
};

// Fungsi untuk menulis data ke file JSON
const writeData = (data) => {
  // `JSON.stringify(data, null, 2)` untuk format JSON yang rapi
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// === API Endpoints ===

// 1. GET /items (Read All + Filter by Status)
app.get('/items', (req, res) => {
  const { status } = req.query;
  let items = readData();

  if (status) {
    // Filter data jika ada query ?status=...
    items = items.filter(
      (item) => item.status.toLowerCase() === status.toLowerCase()
    );
  }

  res.status(200).json(items);
});

// 2. POST /items (Create)
app.post('/items', (req, res) => {
  const items = readData();
  const { nama, status, tanggalMasuk, tanggalSelesai } = req.body;

  // Validasi sederhana
  if (!nama || !status || !tanggalMasuk) {
    return res.status(400).json({
      message: 'Error: Field nama, status, dan tanggalMasuk harus diisi.',
    });
  }

  // Cari ID tertinggi, lalu + 1
  const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

  const newItem = {
    id: newId,
    nama: nama,
    status: status,
    tanggalMasuk: tanggalMasuk,
    tanggalSelesai: tanggalSelesai || '-', // Default tanggalSelesai
  };

  items.push(newItem);
  writeData(items);

  // Response sesuai README
  res.status(201).json({
    message: 'Data sepatu berhasil ditambahkan.',
  });
});

// 3. PUT /items/:id (Update)
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status, tanggalSelesai } = req.body;
  const items = readData();

  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Data tidak ditemukan.' });
  }

  // Update data lama dengan data baru
  const updatedItem = { ...items[itemIndex], ...req.body };
  items[itemIndex] = updatedItem;
  
  writeData(items);

  // Response sesuai README
  res.status(200).json({
    message: 'Status sepatu berhasil diperbarui.',
  });
});

// 4. DELETE /items/:id (Delete)
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const items = readData();

  const newItems = items.filter((item) => item.id !== id);

  if (items.length === newItems.length) {
    return res.status(404).json({ message: 'Data tidak ditemukan.' });
  }

  writeData(newItems);

  // Response sesuai README
  res.status(200).json({
    message: 'Data sepatu berhasil dihapus.',
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server API berjalan di http://localhost:${port}`);
});