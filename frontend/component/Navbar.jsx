export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <span className="font-bold">InventoryApp</span>
      <a href="/inventory" className="hover:underline">Inventory</a>
    </nav>
  );
}