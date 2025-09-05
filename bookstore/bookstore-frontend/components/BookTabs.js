export default function BookTabs({ selected, setSelected, categories }) {
  return (
    <div className="flex gap-3 overflow-x-auto border-b pb-2">
      <button onClick={() => setSelected(null)} className={`py-2 px-4 ${!selected ? 'bg-blue-600 text-white' : 'bg-white'}`}>All</button>
      {categories.map(cat => (
        <button key={cat.id} onClick={() => setSelected(cat.id)} className={`py-2 px-4 ${selected === cat.id ? 'bg-blue-600 text-white' : 'bg-white'}`}>
          {cat.name}
        </button>
      ))}
    </div>
  );
}
