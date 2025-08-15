import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Admin Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">Select a section from the sidebar to manage your store.</p>
      <div className="flex justify-center gap-4">
        <Link href="/admin/products" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Manage Products
        </Link>
        <Link href="/admin/categories" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
            Manage Categories
        </Link>
      </div>
    </div>
  );
}
