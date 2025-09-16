import { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3002/items', {
      headers: { Authorization: 'Bearer fake-jwt' }
    })
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(it => (
          <ItemCard key={it.id} item={it} />
        ))}
      </div>
    </div>
  );
}