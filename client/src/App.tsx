import { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
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

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      // Extract response from OpenRouter (adjust if structure is different)
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Upload an Image</h1>
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
        className="bg-blue-500 text-white p-2 rounded border-blue-500 hover:border-blue-600 hover:bg-blue-600"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {result && (
        <div className="p-4 bg-white rounded shadow w-full max-w-md text-center">
          <p className="text-gray-800 font-medium">🧠 Result:</p>
          <p className="mt-2 text-lg">{result}</p>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default App;
