import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const baseUrl = import.meta.env.PROD
    ? "https://photonshop.fly.dev"
    : "http://localhost:3000";

  const handleRegister = async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("✅ Registered and logged in!");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      alert("❌ Network error");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
}
