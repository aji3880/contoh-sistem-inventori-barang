export default function ItemCard({ item }) {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg">{item.name}</h3>
      <p className="text-gray-600">Stock: {item.stock}</p>
      <p className="text-sm text-gray-400">Category: {item.category}</p>
    </div>
  );
}