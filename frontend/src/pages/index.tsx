import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated()) {
      router.push('/shop');
    }
  }, [isAuthenticated(), router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="container-main py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            🎮 DIM-S Store
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <a className="px-6 py-2 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50 transition">
                Masuk
              </a>
            </Link>
            <Link href="/register">
              <a className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                Daftar
              </a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-main py-24">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Toko Top Up Game Paling Murah Se-Indonesia
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Jangan cuma jajan, tapi jajan dengan hemat! Dapatkan diamond, UC, dan kredit game favorit Anda dengan harga terbaik.
          </p>
          <Link href="/register">
            <a className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-lg hover:shadow-lg transition">
              Mulai Sekarang 🚀
            </a>
          </Link>
        </div>
      </section>

      {/* Games Grid */}
      <section className="bg-white py-20">
        <div className="container-main">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            🎯 Game Populer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: 'Mobile Legends', emoji: '⚔️' },
              { name: 'PUBG Mobile', emoji: '🔫' },
              { name: 'Valorant', emoji: '💎' },
              { name: 'Roblox', emoji: '🏗️' },
              { name: 'Genshin Impact', emoji: '🌟' },
            ].map((game) => (
              <div key={game.name} className="card hover:shadow-lg transition cursor-pointer text-center">
                <div className="text-5xl mb-3">{game.emoji}</div>
                <h3 className="font-bold text-gray-900">{game.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-main py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          ✨ Kenapa Pilih Kami?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card shadow-lg">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Harga Termurah</h3>
            <p className="text-gray-600">Bandingkan dengan toko lain, kami pasti lebih murah!</p>
          </div>
          <div className="card shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Instan</h3>
            <p className="text-gray-600">Pembayaran terverifikasi, items langsung masuk ke akun!</p>
          </div>
          <div className="card shadow-lg">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Aman</h3>
            <p className="text-gray-600">Transaksi enkripsi dan support 24/7 untuk membantu Anda</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container-main text-center">
          <p>© 2026 DIM-S Store. Toko top up game paling murah se-Indonesia 🇮🇩</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
