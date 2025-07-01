"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "@/app/utils/cookies";
import axios, { AxiosError } from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RegisterData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  inviteCode: string;
}

interface FormErrors {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  companyName: string;
  inviteCode: string;
}

interface ApiErrorResponse {
  message?: string;
}

interface RegisterResponse {
  user?: {
    _id: string;
    [key: string]: unknown;
  };
  workspace?: {
    [key: string]: unknown;
  };
  message?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [registrationType, setRegistrationType] = useState<"new" | "invite">("new");

  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    inviteCode: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    companyName: "",
    inviteCode: "",
  });

  // Memoize the redirect function to avoid useEffect dependency issues
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

  function handleRegistrationTypeChange(type: "new" | "invite") {
    setRegistrationType(type);
    setRegisterData((prev) => ({
      ...prev,
      companyName: "",
      inviteCode: "",
    }));
    setFormErrors((prev) => ({
      ...prev,
      companyName: "",
      inviteCode: "",
    }));
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const errors: FormErrors = {
      name: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      companyName: "",
      inviteCode: "",
    };

    let hasError = false;

    // Validasyonlar
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!registerData.name.trim()) {
      errors.name = "Ad zorunludur.";
      hasError = true;
    }
    if (!registerData.lastname.trim()) {
      errors.lastname = "Soyad zorunludur.";
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
    if (registrationType === "new" && !registerData.companyName.trim()) {
      errors.companyName = "Şirket adı zorunludur.";
      hasError = true;
    }
    if (registrationType === "invite" && !registerData.inviteCode.trim()) {
      errors.inviteCode = "Davet kodu zorunludur.";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    const requestData = {
      name: registerData.name,
      lastname: registerData.lastname,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
      ...(registrationType === "new"
        ? { companyName: registerData.companyName }
        : { inviteCode: registerData.inviteCode }),
    };

    try {
      // API instance'ını kullan - tutarlı URL için
      const response = await api.post<RegisterResponse>("/auth/register", requestData);

      if (response.data && response.data.user) {
        const tempToken = response.data.user._id || "access_token";
        try {
          setCookie("userToken", tempToken, 7);
          setCookie("userData", JSON.stringify(response.data.user), 7);
          if (response.data.workspace) {
            setCookie("workspaceData", JSON.stringify(response.data.workspace), 7);
          }
        } catch (cookieError) {
          console.warn("Cookie yazma hatası:", cookieError);
        }

        redirectToDashboard();
      } else {
        setFormErrors((prev) => ({
          ...prev,
          email: response.data?.message || "Kayıt başarısız.",
        }));
      }
    } catch (error: unknown) {
      console.error("Hata detayları:", error);

      let errorMessage = "Bilinmeyen bir hata oluştu.";
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        
        // Detaylı hata logları
        console.log("Error details:", {
          code: axiosError.code,
          message: axiosError.message,
          response: axiosError.response?.data,
          status: axiosError.response?.status,
          config: {
            url: axiosError.config?.url,
            baseURL: axiosError.config?.baseURL,
            method: axiosError.config?.method
          }
        });

        if (axiosError.code === 'ERR_NETWORK') {
          errorMessage = `Ağ hatası: Sunucuya ulaşılamıyor. URL: ${baseUrl}`;
        } else if (axiosError.code === 'ECONNREFUSED') {
          errorMessage = "Bağlantı reddedildi. Sunucu çalışıyor mu?";
        } else if (axiosError.code === 'ETIMEDOUT') {
          errorMessage = "İstek zaman aşımına uğradı.";
        } else if (axiosError.response) {
          errorMessage = axiosError.response.data?.message || `Sunucu hatası: ${axiosError.response.status}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setFormErrors((prev) => ({ ...prev, email: errorMessage }));
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleRegister() {
    window.location.href = `${baseUrl}/auth/google`;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Kayıt Ol</h1>

        {/* Debug bilgisi - sadece development için */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-yellow-100 text-xs text-left text-black">
            <strong>Debug:</strong> API URL: {baseUrl}
          </div>
        )}

        {/* Kayıt Türü Seçimi */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-black">
          <h3 className="text-sm font-semibold mb-3">Kayıt Türü</h3>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="registrationType"
                value="new"
                checked={registrationType === "new"}
                onChange={() => handleRegistrationTypeChange("new")}
                className="mr-2 accent-black"
              />
              <span className="text-sm">Yeni Şirket</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="registrationType"
                value="invite"
                checked={registrationType === "invite"}
                onChange={() => handleRegistrationTypeChange("invite")}
                className="mr-2 accent-black"
              />
              <span className="text-sm">Davet Kodu</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 text-left">
          {formErrors.name && <p className="text-sm text-red-600">{formErrors.name}</p>}
          <input
            type="text"
            name="name"
            placeholder="Ad"
            value={registerData.name}
            onChange={handleInputChange}
            autoComplete="name"
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.lastname && <p className="text-sm text-red-600">{formErrors.lastname}</p>}
          <input
            type="text"
            name="lastname"
            placeholder="Soyad"
            value={registerData.lastname}
            onChange={handleInputChange}
            autoComplete="family-name"
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
          <input
            type="email"
            name="email"
            placeholder="E-Mail"
            value={registerData.email}
            onChange={handleInputChange}
            autoComplete="email"
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.phone && <p className="text-sm text-red-600">{formErrors.phone}</p>}
          <input
            type="tel"
            name="phone"
            placeholder="Telefon"
            value={registerData.phone}
            onChange={handleInputChange}
            autoComplete="tel"
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.password && <p className="text-sm text-red-600">{formErrors.password}</p>}
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={registerData.password}
            onChange={handleInputChange}
            autoComplete="new-password"
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {registrationType === "new" && (
            <>
              {formErrors.companyName && <p className="text-sm text-red-600">{formErrors.companyName}</p>}
              <input
                type="text"
                name="companyName"
                placeholder="Şirket Adı"
                value={registerData.companyName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
              />
            </>
          )}

          {registrationType === "invite" && (
            <>
              {formErrors.inviteCode && <p className="text-sm text-red-600">{formErrors.inviteCode}</p>}
              <input
                type="text"
                name="inviteCode"
                placeholder="Davet Kodu"
                value={registerData.inviteCode}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
              />
            </>
          )}

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