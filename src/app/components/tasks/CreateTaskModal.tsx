"use client";
import { useState, useEffect, useCallback } from "react";
import { X, Search, ChevronDown } from "lucide-react";

interface Option {
	value: string;
	label: string;
}

interface CreateTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	workspaceId: string;
	workspaceTaskId?: string;
	userId: string;
}

interface User {
	id: number;
	name: string | null;
	firstName: string;
	lastName: string;
}

interface Project {
	id: number;
	name: string;
}

// Dark theme hook
const useDarkMode = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		// Çerezlerden tema bilgisini al
		const getCookie = (name: string) => {
			const value = `; ${document.cookie}`;
			const parts = value.split(`; ${name}=`);
			if (parts.length === 2) return parts.pop()?.split(';').shift();
		};

		const theme = getCookie('theme');
		setIsDark(theme === 'dark');

		// Tema değişikliklerini dinle
		const handleThemeChange = () => {
			const newTheme = getCookie('theme');
			setIsDark(newTheme === 'dark');
		};

		window.addEventListener('storage', handleThemeChange);
		return () => window.removeEventListener('storage', handleThemeChange);
	}, []);

	return isDark;
};

// Searchable Multi-Select Component
const SearchableMultiSelect = ({
	options,
	selectedValues,
	onChange,
	placeholder,
	isMultiple = false,
	isDark = false,
}: {
	options: Option[];
	selectedValues: string[];
	onChange: (values: string[]) => void;
	placeholder: string;
	isMultiple?: boolean;
	isDark?: boolean;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSelect = (value: string) => {
		if (isMultiple) {
			if (selectedValues.includes(value)) {
				onChange(selectedValues.filter((v) => v !== value));
			} else {
				onChange([...selectedValues, value]);
			}
		} else {
			onChange([value]);
			setIsOpen(false);
		}
	};

	const getDisplayText = () => {
		if (selectedValues.length === 0) return placeholder;
		if (isMultiple) {
			if (selectedValues.length === 1) {
				return (
					options.find((opt) => opt.value === selectedValues[0])?.label || ""
				);
			}
			return `${selectedValues.length} öğe seçildi`;
		}
		return options.find((opt) => opt.value === selectedValues[0])?.label || "";
	};

	const removeItem = (value: string, e: React.MouseEvent) => {
		e.stopPropagation();
		onChange(selectedValues.filter((v) => v !== value));
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (!target.closest(".searchable-multiselect")) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const baseClasses = "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer flex items-center justify-between";
	const lightClasses = "border-gray-300 bg-white text-gray-900";
	const darkClasses = "border-gray-600 bg-gray-800 text-white";

	return (
		<div className="relative searchable-multiselect">
			<div
				className={`${baseClasses} ${isDark ? darkClasses : lightClasses}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className="flex-1 flex flex-wrap gap-1">
					{isMultiple && selectedValues.length > 0 ? (
						selectedValues.map((value) => {
							const option = options.find((opt) => opt.value === value);
							return (
								<span
									key={value}
									className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${isDark
										? 'bg-blue-900 text-blue-200'
										: 'bg-blue-100 text-blue-800'
										}`}
								>
									{option?.label}
									<X
										size={12}
										className={`cursor-pointer ${isDark ? 'hover:text-blue-100' : 'hover:text-blue-600'
											}`}
										onClick={(e) => removeItem(value, e)}
									/>
								</span>
							);
						})
					) : (
						<span
							className={
								selectedValues.length === 0
									? (isDark ? "text-gray-400" : "text-gray-500")
									: (isDark ? "text-white" : "text-gray-900")
							}
						>
							{getDisplayText()}
						</span>
					)}
				</div>
				<ChevronDown
					size={16}
					className={`${isDark ? 'text-gray-400' : 'text-gray-400'} transition-transform ${isOpen ? "rotate-180" : ""
						}`}
				/>
			</div>

			{isOpen && (
				<div className={`absolute z-50 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-hidden ${isDark
					? 'bg-gray-800 border-gray-600'
					: 'bg-white border-gray-300'
					}`}>
					<div className={`p-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
						<div className="relative">
							<Search
								size={16}
								className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-400'
									}`}
							/>
							<input
								type="text"
								placeholder="Ara..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={`w-full pl-10 pr-4 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500 ${isDark
									? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
									: 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
									}`}
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
					</div>
					<div className="max-h-40 overflow-y-auto">
						{filteredOptions.length === 0 ? (
							<div className={`p-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'
								}`}>
								Sonuç bulunamadı
							</div>
						) : (
							filteredOptions.map((option) => (
								<div
									key={option.value}
									className={`p-3 cursor-pointer flex items-center gap-2 ${selectedValues.includes(option.value)
										? (isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-700')
										: (isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-50 text-gray-900')
										}`}
									onClick={() => handleSelect(option.value)}
								>
									{isMultiple && (
										<input
											type="checkbox"
											checked={selectedValues.includes(option.value)}
											onChange={() => { }}
											className="w-4 h-4 text-blue-600"
										/>
									)}
									<span>{option.label}</span>
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default function CreateTaskModal({
	isOpen,
	onClose,
	workspaceId,
	workspaceTaskId,
	userId,
}: CreateTaskModalProps) {
	const isDark = useDarkMode();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		startDate: "",
		dueDate: "",
		assignees: [] as string[],
		supervisors: [] as string[],
		projects: [] as string[],
		files: [] as File[],
	});

	const [users, setUsers] = useState<Option[]>([]);
	const [projects, setProjects] = useState<Option[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);

	const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			// Kullanıcıları çek
			const usersResponse = await fetch(`${API_BASE_URL}/Workspace/${workspaceId}/users`, {
				headers: {
					'Content-Type': 'application/json',
					// Gerekirse authorization header ekle
				}
			});

			if (usersResponse.ok) {
				const usersData: User[] = await usersResponse.json();
				setUsers(usersData.map((user) => ({
					value: user.id.toString(),
					label: user.name || `${user.firstName} ${user.lastName}`,
				})));
			} else {
				console.error('Kullanıcılar yüklenemedi:', usersResponse.status);
				setUsers([]);
			}

			const projectsResponse = await fetch(`${API_BASE_URL}/Workspace/${workspaceId}/projects`, {
				headers: { 'Content-Type': 'application/json' },
			});

			if (projectsResponse.ok) {
				const projectsData: Project[] = await projectsResponse.json();
				setProjects(projectsData.map((project) => ({
					value: project.id.toString(),
					label: project.name,
				})));
			} else {
				console.error('Projeler yüklenemedi:', projectsResponse.status);
				setProjects([]);
			}

		} catch (error) {
			console.error("Veriler çekilirken hata oluştu:", error);
			setUsers([]);
			setProjects([]);
		} finally {
			setLoading(false);
		}
	}, [API_BASE_URL, workspaceId]);

	useEffect(() => {
		if (isOpen) {
			fetchData();
		}
	}, [isOpen, fetchData]);

	const clearForm = () => {
		setFormData({
			title: "",
			description: "",
			startDate: "",
			dueDate: "",
			assignees: [],
			supervisors: [],
			projects: [],
			files: [],
		});
	};

	const handleCancel = useCallback(() => {
		clearForm();
		onClose();
	}, [onClose]);

	const validateForm = () => {
		if (!formData.title.trim()) {
			alert("Lütfen görev başlığını giriniz.");
			return false;
		}
		if (!formData.description.trim()) {
			alert("Lütfen görev açıklamasını giriniz.");
			return false;
		}
		if (formData.assignees.length === 0) {
			alert("Lütfen en az bir atanan kişi seçiniz.");
			return false;
		}
		if (
			formData.startDate &&
			formData.dueDate &&
			formData.startDate > formData.dueDate
		) {
			alert("Başlangıç tarihi, bitiş tarihinden önce olmalıdır.");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) {
			return;
		}

		setSubmitLoading(true);

		try {
			const formDataToSend = new FormData();

			// API endpoint'e göre veri yapısını hazırla
			const taskData = {
				title: formData.title,
				description: formData.description,
				startDate: formData.startDate,
				dueDate: formData.dueDate,
				assigneeIds: formData.assignees.map(id => parseInt(id)),
				supervisorIds: formData.supervisors.map(id => parseInt(id)),
				projectIds: formData.projects.map(id => parseInt(id)),
				createdByUserId: parseInt(userId),
				workspaceId: parseInt(workspaceId),
				workspaceTaskId: workspaceTaskId ? parseInt(workspaceTaskId) : null,
			};

			// JSON olarak gönder
			formDataToSend.append('taskData', JSON.stringify(taskData));

			// Dosyaları ekle
			formData.files.forEach((file) => {
				formDataToSend.append(`files`, file);
			});

			const response = await fetch(
				`${API_BASE_URL}/Workspace/${workspaceId}/WorkspaceTask${workspaceTaskId ? `/${workspaceTaskId}` : ''
				}/Workspaceuser/${userId}`,
				{
					method: "POST",
					body: formDataToSend,
					headers: {
						// Content-Type header'ını FormData için otomatik ayarlanmasına izin ver
					}
				}
			);

			if (response.ok) {
				const result = await response.json();
				console.log("Görev başarıyla oluşturuldu", result);
				clearForm();
				onClose();
				alert("Görev başarıyla oluşturuldu!");
			} else {
				const errorData = await response.json();
				console.error("Görev oluşturulurken hata oluştu:", errorData);
				alert(errorData.message || "Görev oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
			}
		} catch (error) {
			console.error("API isteği sırasında hata oluştu:", error);
			alert("Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.");
		} finally {
			setSubmitLoading(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);

		const maxSize = 10 * 1024 * 1024; // 10MB
		const validFiles = selectedFiles.filter((file) => {
			if (file.size > maxSize) {
				alert(`${file.name} dosyası çok büyük. Maksimum dosya boyutu 10MB'dır.`);
				return false;
			}
			return true;
		});

		setFormData((prev) => ({
			...prev,
			files: [...prev.files, ...validFiles],
		}));
	};

	const removeFile = (index: number) => {
		setFormData((prev) => ({
			...prev,
			files: prev.files.filter((_, i) => i !== index),
		}));
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isOpen) {
				handleCancel();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, handleCancel]);

	if (!isOpen) return null;

	const modalBg = isDark ? 'bg-gray-900' : 'bg-white';
	const textPrimary = isDark ? 'text-white' : 'text-gray-800';
	const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
	const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
	const borderColor = isDark ? 'border-gray-600' : 'border-gray-200';
	const headerBg = isDark ? 'bg-gray-800' : 'bg-gray-50';

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="fixed inset-0 bg-black/40"
				onClick={handleCancel}
				style={{
					backdropFilter: "blur(8px)",
					WebkitBackdropFilter: "blur(8px)",
					zIndex: 9999,
				}}
			/>
			<div
				className={`relative ${modalBg} rounded-lg shadow-xl w-full max-w-4xl mx-4 p-0 overflow-hidden`}
				style={{ zIndex: 10000 }}
			>
				{/* Header */}
				<div className={`flex items-center justify-between p-6 ${borderColor} border-b ${headerBg}`}>
					<h2 className={`text-xl font-semibold ${textPrimary}`}>Görev Oluştur</h2>
					<div className="flex gap-2">
						<button
							onClick={handleCancel}
							className={`px-4 py-2 rounded hover:opacity-80 transition-colors ${isDark
								? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}
							disabled={submitLoading}
						>
							İptal
						</button>
						<button
							onClick={handleSubmit}
							disabled={submitLoading || loading}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitLoading ? "Kaydediliyor..." : "Kaydet"}
						</button>
					</div>
				</div>

				{/* Loading State */}
				{loading && (
					<div className={`absolute inset-0 ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} flex items-center justify-center z-50`}>
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
							<p className={`mt-2 ${textMuted}`}>Veriler yükleniyor...</p>
						</div>
					</div>
				)}

				{/* Form Content */}
				<div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
					{/* Görev Başlığı */}
					<div className="space-y-2">
						<label className={`block text-sm font-medium px-3 py-2 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
							}`}>
							Görev Başlığı *
						</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, title: e.target.value }))
							}
							className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isDark
								? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
								: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
								}`}
							placeholder="Görev başlığını giriniz"
							maxLength={200}
						/>
					</div>

					{/* Görev Açıklaması */}
					<div className="space-y-2">
						<label className={`block text-sm font-medium px-3 py-2 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
							}`}>
							Görev Açıklaması *
						</label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							rows={4}
							className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${isDark
								? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
								: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
								}`}
							placeholder="Görev açıklamasını giriniz"
							maxLength={1000}
						/>
					</div>

					{/* Tarihler */}
					<div className="space-y-2">
						<label className={`block text-sm font-medium px-3 py-2 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
							}`}>
							Tarihler
						</label>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className={`block text-xs mb-1 ${textMuted}`}>
									Başlangıç Tarihi
								</label>
								<input
									type="date"
									value={formData.startDate}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											startDate: e.target.value,
										}))
									}
									className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isDark
										? 'bg-gray-800 border-gray-600 text-white'
										: 'bg-white border-gray-300 text-gray-900'
										}`}
								/>
							</div>
							<div>
								<label className={`block text-xs mb-1 ${textMuted}`}>
									Bitiş Tarihi
								</label>
								<input
									type="date"
									value={formData.dueDate}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											dueDate: e.target.value,
										}))
									}
									className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isDark
										? 'bg-gray-800 border-gray-600 text-white'
										: 'bg-white border-gray-300 text-gray-900'
										}`}
								/>
							</div>
						</div>
					</div>

					{/* Atanan Kişiler */}
					<div className="space-y-2">
						<label className={`block text-sm font-medium px-3 py-2 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
							}`}>
							Atanan Kişiler *
						</label>
						<SearchableMultiSelect
							options={users}
							selectedValues={formData.assignees}
							onChange={(values) =>
								setFormData((prev) => ({ ...prev, assignees: values }))
							}
							placeholder="Atanacak kişileri seçiniz"
							isMultiple={true}
							isDark={isDark}
						/>
					</div>

					{/* Gözetmenler ve Projeler */}
					<div className="space-y-2">
						<label className={`block text-sm font-medium px-3 py-2 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
							}`}>
							Gözetmen ve Proje
						</label>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className={`block text-xs mb-1 ${textMuted}`}>
									Gözetmenler
								</label>
								<SearchableMultiSelect
									options={users}
									selectedValues={formData.supervisors}
									onChange={(values) =>
										setFormData((prev) => ({ ...prev, supervisors: values }))
									}
									placeholder="Gözetmenleri seçiniz"
									isMultiple={true}
									isDark={isDark}
								/>
							</div>
							<div>
								<label className={`block text-xs mb-1 ${textMuted}`}>
									Projeler
								</label>
								<SearchableMultiSelect
									options={projects}
									selectedValues={formData.projects}
									onChange={(values) =>
										setFormData((prev) => ({ ...prev, projects: values }))
									}
									placeholder="Projeleri seçiniz"
									isMultiple={true}
									isDark={isDark}
								/>
							</div>
						</div>
					</div>

					{/* Dosya Yükleme */}
					<div className="space-y-2">
						<label className={`block text-sm font-medium px-3 py-2 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
							}`}>
							Dosya Ekle
						</label>
						<div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-opacity-80 transition-colors ${isDark
							? 'border-gray-600 hover:border-gray-500'
							: 'border-gray-300 hover:border-gray-400'
							}`}>
							<input
								type="file"
								multiple
								onChange={handleFileChange}
								className="hidden"
								id="file-upload"
								accept="*/*"
							/>
							<label
								htmlFor="file-upload"
								className={`cursor-pointer hover:opacity-80 ${textMuted}`}
							>
								<div className="space-y-2">
									<div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'
										}`}>
										<span className={`text-lg ${textMuted}`}>+</span>
									</div>
									<p className={`text-sm ${textMuted}`}>
										Dosya yüklemek için tıklayın
									</p>
									<p className={`text-xs ${textMuted}`}>
										Maksimum dosya boyutu: 10MB
									</p>
								</div>
							</label>
						</div>

						{/* Yüklenen Dosyalar */}
						{formData.files.length > 0 && (
							<div className="space-y-2 mt-4">
								<h4 className={`text-sm font-medium ${textSecondary}`}>
									Yüklenen Dosyalar ({formData.files.length}):
								</h4>
								<div className="space-y-2">
									{formData.files.map((file, index) => (
										<div
											key={index}
											className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'
												}`}
										>
											<div className="flex items-center gap-3">
												<div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900' : 'bg-blue-100'
													}`}>
													<span className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-600'
														}`}>📄</span>
												</div>
												<div>
													<p className={`text-sm font-medium ${textSecondary}`}>
														{file.name}
													</p>
													<p className={`text-xs ${textMuted}`}>
														{formatFileSize(file.size)}
													</p>
												</div>
											</div>
											<button
												onClick={() => removeFile(index)}
												className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
												title="Dosyayı kaldır"
											>
												<X size={16} />
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}