import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="text-center px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Welcome to the Admin Dashboard
      </h1>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Select a section from the sidebar to manage your store.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
        <Link
          href="/admin/products"
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition text-center"
        >
          Manage Products
        </Link>
        <Link
          href="/admin/categories"
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition text-center"
        >
          Manage Categories
        </Link>
      </div>
    </div>
  );
}
