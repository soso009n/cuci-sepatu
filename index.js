require('dotenv').config(); // Panggil dotenv di baris paling atas
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Ambil kredensial dari file .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors()); // Mengaktifkan CORS
app.use(express.json()); // Mem-parsing body request sebagai JSON

// === API Endpoints (Versi Supabase) ===

// 1. GET /items (Read All + Filter by Status)
app.get('/items', async (req, res) => {
  const { status } = req.query;

  let query = supabase.from('items').select('*').order('created_at', { ascending: false });

  // Jika ada query parameter 'status', tambahkan filter
  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});

// 2. POST /items (Create)
app.post('/items', async (req, res) => {
  const { nama, status, tanggalMasuk, tanggalSelesai } = req.body;

  // Validasi (sama seperti sebelumnya)
  if (!nama || !status || !tanggalMasuk) {
    return res.status(400).json({
      message: 'Error: Field nama, status, dan tanggalMasuk harus diisi.',
    });
  }

  const newItem = {
    nama: nama,
    status: status,
    tanggalMasuk: tanggalMasuk,
    tanggalSelesai: tanggalSelesai || '-', // Default tanggalSelesai
  };

  // .insert() ke Supabase
  // .select() agar data yang baru dibuat dikembalikan
  const { data, error } = await supabase
    .from('items')
    .insert(newItem)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Response sesuai README
  res.status(201).json({
    message: 'Data sepatu berhasil ditambahkan.',
    // data: data[0] // Opsional jika ingin menampilkan data yang baru dibuat
  });
});

// 3. PUT /items/:id (Update)
app.put('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { status, tanggalSelesai } = req.body; // Hanya field ini yang di-update di README

  const updateData = {};
  if (status) updateData.status = status;
  if (tanggalSelesai) updateData.tanggalSelesai = tanggalSelesai;

  const { data, error } = await supabase
    .from('items')
    .update(updateData)
    .eq('id', id)
    .select(); // .select() untuk mengecek apakah data ada

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(404).json({ message: 'Data tidak ditemukan.' });
  }

  // Response sesuai README
  res.status(200).json({
    message: 'Status sepatu berhasil diperbarui.',
  });
});

// 4. DELETE /items/:id (Delete)
app.delete('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  const { data, error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .select(); // .select() untuk mengecek apakah data ada sebelum dihapus

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(404).json({ message: 'Data tidak ditemukan.' });
  }

  // Response sesuai README
  res.status(200).json({
    message: 'Data sepatu berhasil dihapus.',
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server API berjalan di http://localhost:${port}`);
});