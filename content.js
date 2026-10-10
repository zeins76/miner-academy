window.LEVELS = [
  {
    depth: '0 m',
    title: 'Apa itu mining',
    summary: 'Buku catatan tanpa pemilik, dan komputer yang berlomba menulis halaman berikutnya.',
    sections: [
      {
        h: 'Buku besar bersama',
        p: [
          'Blockchain adalah buku catatan transaksi yang disalin ke ribuan komputer. Beberapa menit sekali, transaksi baru dikumpulkan menjadi satu blok dan disambung ke ujung rantai.',
          'Tidak ada bank yang memegang buku ini. Siapa pun boleh menyalin dan memeriksa isinya.'
        ]
      },
      {
        h: 'Penambang',
        p: [
          'Penambang adalah komputer yang berlomba mengesahkan blok berikutnya. Yang menang mendapat hadiah blok berupa koin baru, ditambah biaya transaksi di dalam blok itu.',
          'Lomba ini memakan listrik. Karena itulah mengubah catatan lama jadi sangat mahal.'
        ]
      },
      {
        h: 'Proof of Work',
        p: [
          'Metode lomba ini disebut Proof of Work (PoW). Tidak semua koin memakainya. Ethereum pindah ke Proof of Stake pada September 2022, jadi mining GPU untuk Ethereum berhenti. Bitcoin, Litecoin, Monero, dan sejumlah koin lain masih memakai PoW.'
        ]
      }
    ],
    quiz: [
      {
        q: 'Siapa yang mendapat hadiah blok?',
        options: ['Semua komputer di jaringan', 'Penambang yang lebih dulu menemukan blok yang sah', 'Bank sentral', 'Pemilik koin terbanyak'],
        answer: 1,
        why: 'Hadiah blok jatuh ke penambang yang pertama menemukan blok sah.'
      },
      {
        q: 'Kenapa catatan lama sulit diubah di jaringan PoW?',
        options: ['Blok dikunci dengan sandi rahasia', 'Pengubah harus mengulang kerja komputasi blok itu dan semua blok sesudahnya', 'Ada petugas yang memeriksa tiap transaksi', 'Ukuran blok terlalu besar untuk diedit'],
        answer: 1,
        why: 'Setiap blok memuat hash blok sebelumnya, jadi satu perubahan memaksa semua pekerjaan sesudahnya diulang.'
      },
      {
        q: 'Apa yang terjadi pada mining GPU Ethereum sejak September 2022?',
        options: ['Berhenti, karena Ethereum pindah ke Proof of Stake', 'Hadiahnya naik dua kali lipat', 'Pindah ke mesin ASIC', 'Tidak ada perubahan'],
        answer: 0,
        why: 'Ethereum tidak lagi memakai PoW, jadi tidak ada blok yang bisa ditambang dengan GPU.'
      }
    ]
  },
  {
    depth: '50 m',
    title: 'Hash dan nonce',
    summary: 'Cara kerja lomba menambang, dan satu tambang mini untuk kamu coba.',
    demo: 'miner',
    sections: [
      {
        h: 'Hash',
        p: [
          'Fungsi hash mengubah data apa pun menjadi deretan karakter berukuran tetap. SHA-256 selalu menghasilkan 64 karakter heksadesimal, entah masukannya satu huruf atau satu buku.',
          'Ganti satu huruf pada masukan dan seluruh hasilnya berubah. Dari hasil, tidak ada cara menebak masukan selain mencoba satu per satu.'
        ]
      },
      {
        h: 'Nonce',
        p: [
          'Penambang menyusun blok dari data transaksi dan hash blok sebelumnya, lalu menambahkan satu angka bebas bernama nonce. Blok dianggap sah kalau hash-nya lebih kecil dari target. Dalam praktik itu terlihat sebagai hash yang diawali banyak angka nol.',
          'Hasil hash tidak bisa diatur, jadi penambang hanya bisa mencoba nonce 0, 1, 2, dan seterusnya sampai ada yang lolos. Tambang mini di bawah melakukan persis itu.'
        ]
      },
      {
        h: 'Kesulitan',
        p: [
          'Satu digit heksadesimal punya 16 kemungkinan, jadi tiap nol tambahan di depan membuat peluang per percobaan 16 kali lebih kecil. Coba naikkan dari 4 ke 5 nol dan lihat berapa lama ketemunya.',
          'Jaringan menyetel target agar blok baru muncul dengan ritme tertentu. Bitcoin menargetkan sekitar 10 menit per blok dan menyesuaikan tingkat kesulitan setiap 2016 blok.'
        ]
      }
    ],
    quiz: [
      {
        q: 'Kamu mengubah satu huruf pada data blok. Apa yang terjadi pada hash-nya?',
        options: ['Hampir sama, hanya satu karakter berubah', 'Berubah total', 'Tidak berubah', 'Menjadi lebih pendek'],
        answer: 1,
        why: 'Perubahan sekecil apa pun menghasilkan hash yang sama sekali berbeda.'
      },
      {
        q: 'Berapa kali lebih sulit setiap tambahan satu nol heksadesimal di depan hash?',
        options: ['2 kali', '10 kali', '16 kali', '256 kali'],
        answer: 2,
        why: 'Satu digit heksadesimal punya 16 nilai, hanya satu di antaranya yang nol.'
      },
      {
        q: 'Apa fungsi nonce?',
        options: ['Menyimpan alamat dompet penambang', 'Angka yang diganti-ganti sampai hash blok memenuhi target', 'Menentukan harga koin', 'Mengunci blok agar tidak bisa dibaca'],
        answer: 1,
        why: 'Nonce satu-satunya bagian yang bebas diubah penambang untuk mencari hash yang lolos.'
      }
    ]
  },
  {
    depth: '120 m',
    title: 'Perangkat keras',
    summary: 'CPU, GPU, dan ASIC, plus angka yang menentukan layak tidaknya sebuah mesin.',
    sections: [
      {
        h: 'CPU, GPU, ASIC',
        p: [
          'CPU bisa mengerjakan banyak hal tetapi lambat menghitung hash. GPU menjalankan ribuan perhitungan sekaligus dan cocok untuk algoritma yang dirancang tahan ASIC.',
          'ASIC dibuat untuk satu algoritma saja. Ia jauh lebih cepat dan hemat listrik, tetapi tidak bisa dipakai untuk hal lain, dan harga jualnya ikut jatuh kalau koinnya sepi.'
        ]
      },
      {
        h: 'Angka yang dilihat',
        p: [
          'Hashrate adalah jumlah hash per detik, ditulis H/s, kH/s, MH/s, GH/s, atau TH/s. Daya diukur dalam watt. Efisiensi adalah hashrate dibagi daya, misalnya MH/s per watt.',
          'Beberapa algoritma membutuhkan memori besar, sehingga kapasitas VRAM bisa menentukan apakah sebuah kartu masih terpakai.'
        ]
      },
      {
        h: 'Panas dan perawatan',
        p: [
          'Rig menyala 24 jam. Suhu stabil, kipas yang bersih, dan instalasi listrik yang kuat menentukan umur alat. Undervolt menurunkan konsumsi watt dengan hashrate yang hampir sama, dan banyak penambang menyetelnya lebih dulu sebelum apa pun.'
        ]
      }
    ],
    quiz: [
      {
        q: 'Apa keunggulan utama ASIC dibanding GPU?',
        options: ['Bisa menambang semua koin', 'Jauh lebih cepat dan hemat listrik untuk satu algoritma', 'Bisa dipakai bermain game', 'Tidak menghasilkan panas'],
        answer: 1,
        why: 'ASIC dirancang untuk satu algoritma, jadi sangat efisien di situ dan tidak fleksibel di tempat lain.'
      },
      {
        q: 'Satuan mana yang menggambarkan efisiensi?',
        options: ['Watt', 'Hash per detik', 'Hash per detik per watt', 'Gigabyte'],
        answer: 2,
        why: 'Efisiensi membandingkan hasil kerja dengan daya yang dipakai.'
      },
      {
        q: 'Apa yang dilakukan undervolt?',
        options: ['Menaikkan hashrate dengan tegangan lebih tinggi', 'Menurunkan konsumsi daya dengan penurunan hashrate yang kecil', 'Mematikan setengah kipas', 'Mengganti algoritma'],
        answer: 1,
        why: 'Tegangan lebih rendah memangkas watt, sementara hashrate turun sedikit saja.'
      }
    ]
  },
  {
    depth: '220 m',
    title: 'Pool dan pembayaran',
    summary: 'Kenapa penambang kecil bergabung, dan bagaimana hasilnya dibagi.',
    sections: [
      {
        h: 'Solo atau pool',
        p: [
          'Satu rig kecil yang menambang sendirian punya peluang sangat kecil menemukan blok. Pool menggabungkan hashrate banyak orang dan membagi hadiah menurut kontribusi masing-masing.',
          'Hasilnya kecil tetapi datang rutin, berbeda dengan satu hadiah besar yang mungkin tidak pernah muncul.'
        ]
      },
      {
        h: 'Share',
        p: [
          'Pool meminta penambang mengirim share, yaitu hash yang memenuhi target lebih longgar daripada target blok. Share tidak cukup untuk mengesahkan blok, tetapi cukup untuk membuktikan bahwa kerja memang dilakukan, dan pool memakainya sebagai dasar pembagian.'
        ]
      },
      {
        h: 'Skema bayar dan biaya',
        p: [
          'Dua skema yang sering muncul: PPS membayar nilai tetap per share, sedangkan PPLNS membayar menurut share dalam jendela terakhir, sehingga ikut naik turun mengikuti keberuntungan pool.',
          'Fee pool biasanya 0 sampai 3 persen. Lihat juga batas payout minimum dan biaya jaringan saat penarikan.'
        ]
      },
      {
        h: 'Memilih pool',
        p: [
          'Yang layak dicek: ukuran pool, lokasi server terdekat, statistik yang terbuka, rekam jejak pembayaran, dan besar payout minimum.'
        ]
      }
    ],
    quiz: [
      {
        q: 'Apa itu share?',
        options: ['Hadiah yang dibagikan pool', 'Hash yang memenuhi target lebih longgar, dikirim sebagai bukti kerja', 'Saham pool', 'Biaya listrik bersama'],
        answer: 1,
        why: 'Share adalah bukti kerja ringan yang dihitung pool untuk membagi hadiah.'
      },
      {
        q: 'Apa keuntungan pool bagi penambang dengan satu rig kecil?',
        options: ['Hashrate rig jadi lebih tinggi', 'Pembayaran lebih rutin dan mudah diperkirakan', 'Listrik jadi gratis', 'Tidak ada fee'],
        answer: 1,
        why: 'Pool membagi hadiah ke banyak penambang, sehingga pembayaran kecil tetapi sering.'
      },
      {
        q: 'Skema mana yang membayar nilai tetap per share?',
        options: ['PPS', 'PPLNS', 'Solo', 'Halving'],
        answer: 0,
        why: 'PPS (pay per share) membayar tetap per share, apa pun hasil blok pool.'
      }
    ]
  },
  {
    depth: '340 m',
    title: 'Hitung untung rugi',
    summary: 'Listrik, harga koin, dan titik impas, dengan kalkulator yang bisa kamu isi sendiri.',
    demo: 'calc',
    sections: [
      {
        h: 'Pendapatan',
        p: [
          'Pendapatan harian adalah koin per hari dikali harga koin. Perkiraan koin per hari bisa diambil dari kalkulator publik atau statistik pool, karena angkanya berubah mengikuti hashrate dan kesulitan jaringan.'
        ]
      },
      {
        h: 'Biaya',
        p: [
          'Biaya listrik per hari adalah watt dibagi 1000, dikali 24 jam, dikali tarif per kWh. Rig 600 W yang menyala sehari memakai 14,4 kWh.',
          'Tambahkan pendingin, internet, tempat, dan fee pool. Biaya yang terlewat biasanya ada di bagian ini.'
        ]
      },
      {
        h: 'Titik impas',
        p: [
          'Titik impas adalah harga koin yang membuat pendapatan sama dengan biaya. Di bawah harga itu, mesin yang menyala justru merugi.',
          'Balik modal alat adalah harga alat dibagi laba harian. Angkanya cenderung meleset karena laba harian jarang tetap, terutama kalau kesulitan naik.'
        ]
      }
    ],
    quiz: [
      {
        q: 'Rig 500 W menyala 24 jam. Berapa kWh yang terpakai?',
        options: ['5 kWh', '12 kWh', '24 kWh', '500 kWh'],
        answer: 1,
        why: '500 W = 0,5 kW. 0,5 × 24 jam = 12 kWh.'
      },
      {
        q: 'Apa yang dimaksud harga titik impas?',
        options: ['Harga tertinggi koin sepanjang masa', 'Harga koin saat pendapatan sama dengan biaya', 'Harga alat saat dibeli', 'Harga listrik per kWh'],
        answer: 1,
        why: 'Di titik itu laba harian nol. Di bawahnya rugi.'
      },
      {
        q: 'Kenapa laba harian cenderung turun dari waktu ke waktu?',
        options: ['Listrik makin mahal setiap hari', 'Kesulitan jaringan naik saat lebih banyak penambang bergabung', 'Alat menghasilkan hash yang lebih lemah', 'Pool menaikkan fee otomatis'],
        answer: 1,
        why: 'Lebih banyak hashrate di jaringan berarti bagian tiap penambang mengecil.'
      }
    ]
  },
  {
    depth: '480 m',
    title: 'Keamanan',
    summary: 'Seed phrase, penipuan yang paling sering terjadi, dan miner palsu.',
    sections: [
      {
        h: 'Wallet dan seed phrase',
        p: [
          'Seed phrase, yaitu 12 sampai 24 kata, adalah kunci seluruh dompet. Siapa pun yang punya kata-kata itu bisa mengosongkan dompet kamu dari mana saja.',
          'Tulis di kertas dan simpan offline. Jangan difoto, jangan diketik di situs mana pun, jangan dikirim ke siapa pun, termasuk orang yang mengaku admin atau layanan pelanggan.'
        ]
      },
      {
        h: 'Penipuan yang sering muncul',
        p: [
          'Cloud mining dengan janji profit harian tetap, ajakan menggandakan koin, grup yang meminta kamu mengirim koin lebih dulu, dan situs yang menyerupai pool atau bursa resmi. Janji hasil pasti di pasar yang harganya naik turun adalah tanda bahaya.'
        ]
      },
      {
        h: 'Miner palsu',
        p: [
          'Unduh software hanya dari repositori resmi proyeknya, dan cocokkan checksum rilis kalau tersedia. Antivirus sering menandai miner asli sebagai ancaman, jadi peringatan itu tidak otomatis berarti sebuah file aman atau berbahaya. Pakai sumber yang bisa kamu verifikasi.',
          'Pemakaian CPU atau GPU yang tinggi tanpa sebab di komputer biasa bisa jadi tanda miner yang tidak kamu pasang.'
        ]
      },
      {
        h: 'Alamat payout',
        p: [
          'Periksa alamat tujuan dua kali sebelum menyimpannya di pool. Transaksi blockchain tidak bisa dibatalkan.'
        ]
      }
    ],
    quiz: [
      {
        q: 'Siapa yang boleh mengetahui seed phrase kamu?',
        options: ['Admin pool', 'Layanan pelanggan bursa', 'Hanya kamu', 'Teman dekat'],
        answer: 2,
        why: 'Seed phrase memberi akses penuh ke dompet. Layanan resmi tidak pernah memintanya.'
      },
      {
        q: 'Sebuah layanan cloud mining menjanjikan profit 2% per hari. Bagaimana menilainya?',
        options: ['Peluang bagus, segera ikut', 'Tanda bahaya, hasil pasti seperti itu tidak realistis', 'Aman kalau situsnya bagus', 'Aman kalau banyak yang ikut'],
        answer: 1,
        why: 'Hasil tetap di pasar yang berubah-ubah hampir selalu berarti penipuan atau skema piramida.'
      },
      {
        q: 'Kamu salah memasukkan satu karakter pada alamat payout. Apa yang terjadi?',
        options: ['Pool otomatis memperbaikinya', 'Transaksi bisa dibatalkan lewat bank', 'Koin bisa hilang karena transaksi tidak bisa dibatalkan', 'Koin kembali dalam 24 jam'],
        answer: 2,
        why: 'Transaksi blockchain bersifat final, jadi alamat harus benar sejak awal.'
      }
    ]
  },
  {
    depth: '650 m',
    title: 'Memilih koin dan risiko',
    summary: 'Algoritma, halving, dan skenario terburuk yang perlu dihitung sebelum membeli alat.',
    sections: [
      {
        h: 'Algoritma dan koin',
        p: [
          'Mulai dari alat yang kamu punya, lalu cari koin dengan algoritma yang cocok. Cek apakah hasilnya bisa dijual di bursa yang likuid, apakah proyeknya masih dirawat, dan seberapa besar komunitas penambangnya.'
        ]
      },
      {
        h: 'Kesulitan dan halving',
        p: [
          'Banyak koin memangkas hadiah blok sesuai jadwal. Bitcoin melakukannya setiap 210.000 blok, kira-kira empat tahun sekali. Hadiah turun separuh, dan kalau harga tidak ikut naik, pendapatan per hashrate ikut turun.',
          'Kesulitan jaringan yang naik menekan hasil dari sisi lain.'
        ]
      },
      {
        h: 'Risiko',
        p: [
          'Harga koin bisa turun jauh, proyek bisa ditinggalkan, alat bisa sulit dijual, dan aturan serta pajak setempat bisa berubah. Sebelum membeli alat, hitung ulang di kalkulator dengan harga koin turun 50 persen. Kalau masih bertahan, barulah angkanya layak dipertimbangkan.'
        ]
      },
      {
        h: 'Mulai kecil',
        p: [
          'Jalankan alat yang sudah ada selama sebulan dan catat hasil bersihnya setelah listrik. Data sendiri lebih berguna daripada brosur penjual.'
        ]
      }
    ],
    quiz: [
      {
        q: 'Harga koin tetap, lalu terjadi halving. Apa yang terjadi pada pendapatan per hashrate?',
        options: ['Naik dua kali lipat', 'Turun sekitar separuh', 'Tidak berubah', 'Menjadi nol'],
        answer: 1,
        why: 'Hadiah per blok dipangkas separuh, jadi bagian tiap penambang ikut turun.'
      },
      {
        q: 'Skenario mana yang perlu dihitung sebelum membeli alat?',
        options: ['Harga koin naik 10 kali lipat', 'Harga koin turun 50 persen', 'Harga alat turun', 'Tarif listrik gratis'],
        answer: 1,
        why: 'Skenario terburuk menunjukkan apakah kamu masih sanggup menanggungnya.'
      },
      {
        q: 'Apa langkah awal yang paling masuk akal?',
        options: ['Membeli banyak ASIC sekaligus', 'Meminjam uang untuk rig besar', 'Menjalankan alat yang sudah ada dan mencatat hasilnya selama sebulan', 'Ikut cloud mining dengan profit tetap'],
        answer: 2,
        why: 'Data nyata dari alat sendiri lebih jujur daripada janji penjual.'
      }
    ]
  }
];
