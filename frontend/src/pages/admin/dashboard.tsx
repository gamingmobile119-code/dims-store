import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchStats();
  }, [isAuthenticated, user, router]);

  const fetchStats = async () => {
    try {
      const response = await api.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container-main py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 shadow-lg">
        <div className="container-main">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-blue-100 mt-2">Manage your DIM-S Store</p>
        </div>
      </header>

      <main className="container-main py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card shadow-lg border-t-4 border-t-blue-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold mb-2">Total Orders</p>
                <p className="text-4xl font-bold text-blue-600">{stats?.totalOrders}</p>
              </div>
              <div className="text-5xl opacity-20">📦</div>
            </div>
          </div>

          <div className="card shadow-lg border-t-4 border-t-green-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold mb-2">Total Users</p>
                <p className="text-4xl font-bold text-green-600">{stats?.totalUsers}</p>
              </div>
              <div className="text-5xl opacity-20">👥</div>
            </div>
          </div>

          <div className="card shadow-lg border-t-4 border-t-purple-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600">
                  Rp {stats?.totalRevenue.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="text-5xl opacity-20">💰</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/products">
              <a className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-lg font-semibold flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                Manage Products & Pricing
              </a>
            </Link>
            <Link href="/admin/orders">
              <a className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-lg font-semibold flex items-center gap-3">
                <span className="text-2xl">📋</span>
                Manage Orders
              </a>
            </Link>
            <Link href="/admin/analytics">
              <a className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition shadow-lg font-semibold flex items-center gap-3">
                <span className="text-2xl">📊</span>
                Analytics & Reports
              </a>
            </Link>
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-lg font-semibold flex items-center gap-3">
              <span className="text-2xl">💳</span>
              View Payments
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
