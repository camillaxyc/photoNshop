import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.PROD
    ? "https://photonshop.fly.dev"
    : "http://localhost:3000";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      setToken(data.token);
      localStorage.setItem("token", data.token); // 🔐 Save token
    } catch (err) {
      console.error(err);
      setError("Invalid login");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">🔐 Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          className="p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          type="submit"
        >
          Login
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {token && (
        <div className="mt-4 p-2 bg-green-100 text-sm rounded">
          ✅ Logged in! Token saved to localStorage.
        </div>
      )}
    </div>
  );
}

export default Login;
