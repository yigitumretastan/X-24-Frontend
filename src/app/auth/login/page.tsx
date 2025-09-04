"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getCookie, setCookie } from "@/app/utils/cookies";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL|| "https://localhost:7171";

interface LoginRequest {
  email: string;
  phone: string;
  password: string;
  twoFactorCode?: string;
}

interface LoginResponse {
  token?: string;
  message?: string;
  twoFactorRequired?: boolean;
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
}

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  const [loginData, setLoginData] = useState<LoginRequest>({
    email: "",
    phone: "",
    password: "",
  });

  // 2FA kodu 6 karakterden oluşacak
  const [twoFactorCode, setTwoFactorCode] = useState<string[]>(["", "", "", "", "", ""]);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const token = getCookie("userToken");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  }

  // 2FA inputlarında otomatik focus ve kontrol
  function handleTwoFactorChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return; // sadece rakam ve 0-1 karakter olsun
    const newCode = [...twoFactorCode];
    newCode[idx] = val;
    setTwoFactorCode(newCode);
    if (val && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  // 2FA kodunu backend'e gönderip doğrula
  async function verifyTwoFactor() {
    setLoading(true);
    setError("");

    try {
      const code = twoFactorCode.join("");
      if (code.length !== 6) {
        setError("Lütfen 6 haneli doğrulama kodunu giriniz.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...loginData, twoFactorCode: code }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && data.token) {
        setCookie("userToken", data.token, 7);
        router.push("/dashboard");
      } else {
        setError(data.message || "Doğrulama başarısız.");
      }
    } catch (err) {
      setError("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // İki faktörlü doğrulama kodu yoksa gönder
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data: LoginResponse = await response.json();

      if (response.ok) {
        if (data.twoFactorRequired) {
          setTwoFactorRequired(true);
        } else if (data.token) {
          setCookie("userToken", data.token, 7);
          router.push("/dashboard");
        } else {
          setError(data.message || "Giriş başarısız.");
        }
      } else {
        setError(data.message || "Giriş başarısız.");
      }
    } catch (error) {
      setError("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleSignIn(): void {
    alert("Google sign-in clicked (implement OAuth flow)");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Login</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {!twoFactorRequired && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            <input
              type="email"
              name="email"
              placeholder="E-Mail"
              value={loginData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone (optional)"
              value={loginData.phone}
              onChange={handleInputChange}
              disabled={loading}
              className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {twoFactorRequired && (
          <div>
            <p className="mb-4 font-semibold">Lütfen 2 faktörlü doğrulama kodunu giriniz:</p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={twoFactorCode[idx]}
                  onChange={(e) => handleTwoFactorChange(e, idx)}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  disabled={loading}
                  className="w-10 h-10 text-center border border-gray-300 rounded-md text-xl"
                  inputMode="numeric"
                  pattern="\d*"
                />
              ))}
            </div>
            <button
              onClick={verifyTwoFactor}
              disabled={loading}
              className="mt-4 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
            >
              {loading ? "Doğrulanıyor..." : "Doğrula"}
            </button>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-6 w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
        >
          Sign in with Google
        </button>

        {!twoFactorRequired && (
          <p className="mt-4 text-gray-600">
            Hesabınız yok mu?{" "}
            <a href="./register" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Kayıt Ol
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
