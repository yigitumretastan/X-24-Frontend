import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Palette, Monitor, Sun, Moon, Smartphone, Eye, Zap, Sparkles } from "lucide-react";

export default function AppearanceSettings() {
	const { theme, toggleTheme } = useTheme();
	const [selectedTheme, setSelectedTheme] = useState(theme);
	const [accentColor, setAccentColor] = useState("#667eea");
	const [fontSize, setFontSize] = useState("medium");
	const [compactMode, setCompactMode] = useState(false);
	const [animations, setAnimations] = useState(true);
	const [highContrast, setHighContrast] = useState(false);

	useEffect(() => {
		setSelectedTheme(theme);
	}, [theme]);

	const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
		if (newTheme === 'auto') {
			// Auto theme logic can be implemented later
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			setSelectedTheme(prefersDark ? 'dark' : 'light');
		} else {
			setSelectedTheme(newTheme);
			if (newTheme !== theme) {
				toggleTheme();
			}
		}
	};

	const accentColors = [
		{ name: "Mavi", value: "#667eea", gradient: "from-blue-500 to-purple-600" },
		{ name: "Yeşil", value: "#10b981", gradient: "from-green-500 to-emerald-600" },
		{ name: "Mor", value: "#8b5cf6", gradient: "from-purple-500 to-violet-600" },
		{ name: "Pembe", value: "#ec4899", gradient: "from-pink-500 to-rose-600" },
		{ name: "Turuncu", value: "#f59e0b", gradient: "from-orange-500 to-amber-600" },
		{ name: "Kırmızı", value: "#ef4444", gradient: "from-red-500 to-pink-600" },
	];

	const fontSizes = [
		{ id: "small", name: "Küçük", description: "Kompakt görünüm" },
		{ id: "medium", name: "Orta", description: "Varsayılan boyut" },
		{ id: "large", name: "Büyük", description: "Daha kolay okunur" },
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h2 className={`text-2xl font-bold mb-2 ${
					theme === 'dark' ? 'text-white' : 'text-gray-900'
				}`}>
					Görünüm Ayarları
				</h2>
				<p className={`text-sm ${
					theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
				}`}>
					Uygulamanın görünümünü ve hissini özelleştirin
				</p>
			</div>

			{/* Theme Selection */}
			<div className={`p-6 rounded-xl border ${
				theme === 'dark' 
					? 'bg-gray-800/50 border-gray-700/50' 
					: 'bg-gray-50/50 border-gray-200/50'
			}`}>
				<h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
					theme === 'dark' ? 'text-white' : 'text-gray-900'
				}`}>
					<Palette className="w-5 h-5 text-blue-500" />
					Tema Seçimi
				</h3>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Light Theme */}
					<button
						onClick={() => handleThemeChange('light')}
						className={`p-4 rounded-xl border-2 transition-all duration-200 ${
							selectedTheme === 'light'
								? 'border-blue-500 bg-blue-50/50'
								: theme === 'dark'
									? 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
									: 'border-gray-200 hover:border-gray-300 bg-white/50'
						}`}
					>
						<div className="flex flex-col items-center gap-3">
							<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-100 border border-gray-200 flex items-center justify-center">
								<Sun className="w-6 h-6 text-yellow-500" />
							</div>
							<div className="text-center">
								<h4 className={`font-medium ${
									theme === 'dark' ? 'text-white' : 'text-gray-900'
								}`}>
									Açık Tema
								</h4>
								<p className={`text-xs mt-1 ${
									theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}>
									Gündüz kullanım için ideal
								</p>
							</div>
						</div>
					</button>

					{/* Dark Theme */}
					<button
						onClick={() => handleThemeChange('dark')}
						className={`p-4 rounded-xl border-2 transition-all duration-200 ${
							selectedTheme === 'dark'
								? 'border-blue-500 bg-blue-50/50'
								: theme === 'dark'
									? 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
									: 'border-gray-200 hover:border-gray-300 bg-white/50'
						}`}
					>
						<div className="flex flex-col items-center gap-3">
							<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
								<Moon className="w-6 h-6 text-blue-400" />
							</div>
							<div className="text-center">
								<h4 className={`font-medium ${
									theme === 'dark' ? 'text-white' : 'text-gray-900'
								}`}>
									Koyu Tema
								</h4>
								<p className={`text-xs mt-1 ${
									theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}>
									Gece kullanım için ideal
								</p>
							</div>
						</div>
					</button>

					{/* Auto Theme */}
					<button
						onClick={() => handleThemeChange('auto')}
						className={`p-4 rounded-xl border-2 transition-all duration-200 ${
							theme === 'dark'
								? 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
								: 'border-gray-200 hover:border-gray-300 bg-white/50'
						}`}
					>
						<div className="flex flex-col items-center gap-3">
							<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
								<Monitor className="w-6 h-6 text-white" />
							</div>
							<div className="text-center">
								<h4 className={`font-medium ${
									theme === 'dark' ? 'text-white' : 'text-gray-900'
								}`}>
									Otomatik
								</h4>
								<p className={`text-xs mt-1 ${
									theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}>
									Sistem ayarını takip et
								</p>
							</div>
						</div>
					</button>
				</div>
			</div>

			{/* Accent Colors */}
			<div className={`p-6 rounded-xl border ${
				theme === 'dark' 
					? 'bg-gray-800/50 border-gray-700/50' 
					: 'bg-gray-50/50 border-gray-200/50'
			}`}>
				<h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
					theme === 'dark' ? 'text-white' : 'text-gray-900'
				}`}>
					<Sparkles className="w-5 h-5 text-blue-500" />
					Vurgu Rengi
				</h3>
				
				<div className="grid grid-cols-3 md:grid-cols-6 gap-3">
					{accentColors.map((color) => (
						<button
							key={color.value}
							onClick={() => setAccentColor(color.value)}
							className={`group relative p-3 rounded-xl transition-all duration-200 ${
								accentColor === color.value
									? 'ring-2 ring-offset-2 ring-blue-500 scale-105'
									: 'hover:scale-105'
							} ${theme === 'dark' ? 'ring-offset-gray-800' : 'ring-offset-white'}`}
						>
							<div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color.gradient} mx-auto`}></div>
							<p className={`text-xs mt-2 text-center ${
								theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
							}`}>
								{color.name}
							</p>
						</button>
					))}
				</div>
			</div>

			{/* Font Size */}
			<div className={`p-6 rounded-xl border ${
				theme === 'dark' 
					? 'bg-gray-800/50 border-gray-700/50' 
					: 'bg-gray-50/50 border-gray-200/50'
			}`}>
				<h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
					theme === 'dark' ? 'text-white' : 'text-gray-900'
				}`}>
					<Eye className="w-5 h-5 text-blue-500" />
					Yazı Boyutu
				</h3>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{fontSizes.map((size) => (
						<button
							key={size.id}
							onClick={() => setFontSize(size.id)}
							className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
								fontSize === size.id
									? 'border-blue-500 bg-blue-50/50'
									: theme === 'dark'
										? 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
										: 'border-gray-200 hover:border-gray-300 bg-white/50'
							}`}
						>
							<h4 className={`font-medium ${
								size.id === 'small' ? 'text-sm' : size.id === 'large' ? 'text-lg' : 'text-base'
							} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
								{size.name}
							</h4>
							<p className={`text-xs mt-1 ${
								theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
							}`}>
								{size.description}
							</p>
						</button>
					))}
				</div>
			</div>

			{/* Advanced Settings */}
			<div className={`p-6 rounded-xl border ${
				theme === 'dark' 
					? 'bg-gray-800/50 border-gray-700/50' 
					: 'bg-gray-50/50 border-gray-200/50'
			}`}>
				<h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
					theme === 'dark' ? 'text-white' : 'text-gray-900'
				}`}>
					<Zap className="w-5 h-5 text-blue-500" />
					Gelişmiş Ayarlar
				</h3>
				
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h4 className={`font-medium ${
								theme === 'dark' ? 'text-white' : 'text-gray-900'
							}`}>
								Kompakt Mod
							</h4>
							<p className={`text-sm ${
								theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
							}`}>
								Daha az boşluk, daha fazla içerik
							</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={compactMode}
								onChange={(e) => setCompactMode(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
						</label>
					</div>

					<div className="flex items-center justify-between">
						<div>
							<h4 className={`font-medium ${
								theme === 'dark' ? 'text-white' : 'text-gray-900'
							}`}>
								Animasyonlar
							</h4>
							<p className={`text-sm ${
								theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
							}`}>
								Geçiş efektleri ve animasyonlar
							</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={animations}
								onChange={(e) => setAnimations(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
						</label>
					</div>

					<div className="flex items-center justify-between">
						<div>
							<h4 className={`font-medium ${
								theme === 'dark' ? 'text-white' : 'text-gray-900'
							}`}>
								Yüksek Kontrast
							</h4>
							<p className={`text-sm ${
								theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
							}`}>
								Erişilebilirlik için daha net renkler
							</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={highContrast}
								onChange={(e) => setHighContrast(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
						</label>
					</div>
				</div>
			</div>

			{/* Preview Section */}
			<div className={`p-6 rounded-xl border ${
				theme === 'dark' 
					? 'bg-gray-800/50 border-gray-700/50' 
					: 'bg-gray-50/50 border-gray-200/50'
			}`}>
				<h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
					theme === 'dark' ? 'text-white' : 'text-gray-900'
				}`}>
					<Smartphone className="w-5 h-5 text-blue-500" />
					Önizleme
				</h3>
				
				<div className={`p-4 rounded-lg border ${
					theme === 'dark' 
						? 'bg-gray-900/50 border-gray-700/50' 
						: 'bg-white/50 border-gray-200/50'
				}`}>
					<div className="flex items-center gap-3 mb-3">
						<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
						<div>
							<h4 className={`font-medium ${
								fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base'
							} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
								Örnek Başlık
							</h4>
							<p className={`${
								fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm'
							} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
								Bu bir önizleme metnidir
							</p>
						</div>
					</div>
					<button 
						className="btn-primary px-4 py-2 text-sm"
						style={{ background: accentColor }}
					>
						Örnek Buton
					</button>
				</div>
			</div>
		</div>
	);
}
