"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "@/app/utils/cookies";
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7171';

const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  token?: string;
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  message?: string;
}


export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const redirectToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  useEffect(() => {
    const token = getCookie("userToken");
    if (token) {
      redirectToDashboard();
    }
  }, [redirectToDashboard]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const errors: FormErrors = {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    let hasError = false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!registerData.name.trim()) {
      errors.name = "Ad zorunludur.";
      hasError = true;
    }
    if (!registerData.lastName.trim()) {
      errors.lastName = "Soyad zorunludur.";
      hasError = true;
    }
    if (!emailRegex.test(registerData.email)) {
      errors.email = "Geçerli bir e-posta girin.";
      hasError = true;
    }
    if (!phoneRegex.test(registerData.phone)) {
      errors.phone = "Geçerli bir telefon numarası girin.";
      hasError = true;
    }
    if (!passwordRegex.test(registerData.password)) {
      errors.password = "Şifre en az 6 karakter olmalı, bir büyük harf ve bir rakam içermeli.";
      hasError = true;
    }
    if (!registerData.confirmPassword) {
      errors.confirmPassword = "Şifre tekrar zorunludur.";
      hasError = true;
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Şifreler uyuşmuyor.";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    const requestData = {
      name: registerData.name,
      lastName: registerData.lastName,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
      confirmPassword: registerData.confirmPassword,
    };

    try {
      const response = await api.post<RegisterResponse>("/api/auth/register", requestData);

      if (response.data && response.data.token) {
        setCookie("userToken", response.data.token, 7);
        setCookie("userData", JSON.stringify({
          name: response.data.name,
          lastName: response.data.lastName,
          email: response.data.email,
          phone: response.data.phone,
        }), 7);
        redirectToDashboard();
      } else {
        setFormErrors(prev => ({
          ...prev,
          email: response.data?.message || "Kayıt başarısız.",
        }));
      }

    } catch (error: unknown) {
      let errorMessage = "Bilinmeyen bir hata oluştu.";

      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          errorMessage = `Ağ hatası: Sunucuya ulaşılamıyor.`;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Sunucu hatası: ${error.response?.status || 'Bilinmiyor'}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setFormErrors(prev => ({ ...prev, email: errorMessage }));
    }
    finally {
      setLoading(false);
    }
  }

  function handleGoogleRegister() {
    window.location.href = `${baseUrl}/api/Auth/signin-google`;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Kayıt Ol</h1>

        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 text-left">
          {formErrors.name && <p className="text-sm text-red-600">{formErrors.name}</p>}
          <input
            type="text"
            name="name"
            placeholder="Ad"
            value={registerData.name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.lastName && <p className="text-sm text-red-600">{formErrors.lastName}</p>}
          <input
            type="text"
            name="lastName"
            placeholder="Soyad"
            value={registerData.lastName}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
          <input
            type="email"
            name="email"
            placeholder="E-Mail"
            value={registerData.email}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.phone && <p className="text-sm text-red-600">{formErrors.phone}</p>}
          <input
            type="tel"
            name="phone"
            placeholder="Telefon"
            value={registerData.phone}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.password && <p className="text-sm text-red-600">{formErrors.password}</p>}
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={registerData.password}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.confirmPassword && <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Şifre Tekrar"
            value={registerData.confirmPassword}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Kayıt olunuyor..." : "Kayıt Ol"}
          </button>
        </form>

        <button
          onClick={handleGoogleRegister}
          className="mt-6 w-full bg-black text-white py-3 rounded-md flex items-center justify-center gap-3 hover:bg-gray-900 transition"
        >
          Google ile Kayıt Ol
        </button>

        <p className="mt-4 text-gray-600 text-sm">
          Hesabınız var mı?{" "}
          <a href="/auth/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
            Giriş Yap
          </a>
        </p>
      </div>
    </main>
  );
}
