"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5231";
const api = axios.create({ baseURL: baseUrl, headers: { "Content-Type": "application/json" } });

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Tek bir göz simgesiyle tüm şifreleri göster/gizle
  const [showPasswords, setShowPasswords] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/Auth/reset-password", {
        email,
        token,
        newPassword: password,
        confirmPassword: confirmPassword
      });

      router.push("/auth/login"); 
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Bir hata oluştu");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Bilinmeyen bir hata oluştu");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center text-black">
        <h1 className="text-3xl font-extrabold mb-4">Şifre Sıfırlama</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              placeholder="Yeni Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md p-3 w-full text-black"
            />
          </div>

          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              placeholder="Yeni Şifre Tekrar"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-md p-3 w-full text-black"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPasswords ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Şifre Sıfırlanıyor..." : "Şifreyi Sıfırla"}
          </button>
        </form>
      </div>
    </main>
  );
}
