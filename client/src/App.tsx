import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type SearchResult = {
  title: string;
  price: string;
  link: string;
  thumbnail: string;
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
      setResults([]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setResult(null);
    setError(null);

    const baseUrl = import.meta.env.PROD
      ? "https://photonshop.fly.dev"
      : "http://localhost:3000";

    try {
      const res = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      const content = data.choices?.[0]?.message?.content;
      if (content) {
        setResult(content);
      } else {
        setError("No result returned.");
      }
    } catch (err) {
      setError("Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchItems = async (description: string) => {
    const baseUrl = import.meta.env.PROD
      ? "https://photonshop.fly.dev"
      : "http://localhost:3000";

    try {
      const res = await fetch(
        `${baseUrl}/search?q=${encodeURIComponent(description)}`
      );
      const data = await res.json();

      if (data.results) {
        console.log("🛍️ Found:", data.results);
        setResults(data.results);
      } else {
        console.log("No results found.");
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
  };

  useEffect(() => {
    if (result) {
      searchItems(result);
    }
  }, [result]);

  const saveItem = async (item: SearchResult) => {
    const baseUrl = import.meta.env.PROD
      ? "https://photonshop.fly.dev"
      : "http://localhost:3000";
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/saved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: item.title,
          link: item.link,
          price: item.price,
          thumbnail: item.thumbnail,
        }),
      });

      if (!res.ok) throw new Error("Failed to save item");
      alert("✅ Saved!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("❌ Could not save item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start gap-6 p-6">
      <div className="flex flex-row items-start gap-6">
        <Link to="/register" className="text-blue-500 hover:underline">
          <button className="bg-blue-500 text-white p-2 rounded border-blue-500 hover:border-blue-600 hover:bg-blue-600 disabled:opacity-50">
            Register
          </button>
        </Link>
        <Link to="/Login" className="text-blue-500 hover:underline">
          <button className="bg-blue-500 text-white p-2 rounded border-blue-500 hover:border-blue-600 hover:bg-blue-600 disabled:opacity-50">
            Login
          </button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold">🖼️ Upload an Image to Find Matches</h1>
      <input
        className="file:bg-blue-500 file:text-white file:p-1 file:rounded file:border-blue-500 file:cursor-pointer file:hover:bg-blue-600"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {preview && (
        <div className="w-full max-w-md mx-auto p-4 flex items-center justify-center border-blue-500 rounded border-2 border-dashed">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-64 object-contain border rounded shadow"
          />
        </div>
      )}
      <button
        className="bg-blue-500 text-white p-2 rounded border-blue-500 hover:border-blue-600 hover:bg-blue-600 disabled:opacity-50"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>
      {result && (
        <div className="p-4 bg-white rounded shadow w-full max-w-md text-center">
          <p className="text-gray-800 font-medium">🧠 AI Description:</p>
          <p className="mt-2 text-lg">{result}</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <Link to="/saved" className="text-blue-500 hover:underline">
        View Saved Items
      </Link>
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl mt-6">
          {results.map((item) => (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={item.link}
              className="block border p-4 rounded shadow hover:bg-gray-100 bg-white"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-48 object-contain mb-2"
              />
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-500">{item.price}</div>
              <button
                className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => saveItem(item)}
              >
                💗 Save Item
              </button>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
