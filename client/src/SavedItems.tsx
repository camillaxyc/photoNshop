import { useEffect, useState } from "react";

type SavedItem = {
  _id: string;
  title: string;
  price: string;
  link: string;
  thumbnail: string;
};

function SavedItems() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.PROD
    ? "https://photonshop.fly.dev"
    : "http://localhost:3000";

  useEffect(() => {
    const fetchSavedItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to see your saved items.");
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/saved`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch saved items");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch saved items");
      }
    };

    fetchSavedItems();
  }, []);

  const deleteItem = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${baseUrl}/saved/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">💗 Your Saved Items</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded shadow flex flex-col items-center"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-32 h-32 object-contain mb-2"
            />
            <div className="font-semibold text-center">{item.title}</div>
            <div className="text-sm text-gray-600">{item.price}</div>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-1"
            >
              View
            </a>
            <button
              onClick={() => deleteItem(item._id)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && !error && (
        <p className="text-gray-600 mt-4 text-center">No items saved yet.</p>
      )}
    </div>
  );
}

export default SavedItems;
