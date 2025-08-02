import { useState } from "react";

export default function StudentLoginPage() {
  const [rin, setRin] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rin || !email) return alert("Please enter both RIN and email.");

    console.log("Student login:", { rin, email });
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#202225] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white rounded-lg p-8 shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6">Student Login</h2>
        <input
          type="text"
          value={rin}
          placeholder="Enter your RIN"
          onChange={(e) => setRin(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          value={email}
          placeholder="Enter your RPI Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
