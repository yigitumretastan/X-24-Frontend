"use client";

import { useState, useEffect } from "react";

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
	.split("; ")
	.find((row) => row.startsWith("theme="))
	?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light"; 
}

export default function DiskPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
	setTheme(getThemeFromCookies());
  }, []);

  return (
	<main className={`min-h-screen flex items-center justify-center p-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
	  <h1 className="text-4xl font-bold">Disk Sayfasına Hoşgeldiniz</h1>
	</main>
  );
}
