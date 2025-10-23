# REST API Daftar Barang Cuci Sepatu

## Deskripsi Umum

Proyek ini merupakan tugas responsi untuk modul Pembuatan API dengan JavaScript. API ini dibuat menggunakan Node.js dan Express.js, berfungsi untuk mengelola data sepatu yang sedang dicuci pada sebuah layanan jasa cuci sepatu.

Tujuan utama proyek ini adalah untuk mempermudah proses pencatatan, pemantauan, dan pembaruan status cucian sepatu secara digital melalui REST API sederhana.

## Tujuan

* Mengimplementasikan konsep CRUD (Create, Read, Update, Delete) dalam REST API.
* Meningkatkan pemahaman penggunaan Express.js sebagai framework backend.
* Mengelola data menggunakan format JSON sebagai penyimpanan sederhana.
* Membangun sistem pencatatan yang relevan dengan kebutuhan bisnis nyata.

## Fitur Utama API

| Metode | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/items` | Menampilkan seluruh daftar sepatu yang sedang dicuci. |
| `POST` | `/items` | Menambahkan data sepatu baru ke dalam daftar. |
| `PUT` | `/items/:id` | Memperbarui status sepatu (misalnya dari Sedang Dicuci menjadi Selesai). |
| `DELETE` | `/items/:id` | Menghapus data sepatu yang sudah selesai dicuci. |

## Struktur Data

Contoh struktur data sepatu yang disimpan:

```json
{
  "id": 1,
  "nama": "Nike Air Force 1",
  "status": "Sedang Dicuci",
  "tanggalMasuk": "2025-10-08",
  "tanggalSelesai": "-"
}