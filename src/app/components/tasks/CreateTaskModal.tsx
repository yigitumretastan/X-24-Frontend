"use client";
import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePostApiProjectsList } from "@/api/generated/projects/projects";
import { usePostApiWorkspaceTasksSaveorupdate } from "@/api/generated/workspace-tasks/workspace-tasks";
import { useGetWorkspaceUsers } from "@/api/generated/workspace-users/workspace-users";
import type { WorkspaceUserDto } from "@/api/model/workspaceUserDto";

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

// Dark theme hook
const useDarkMode = () => {
	const [isDark, setIsDark] = useState(false);
	useEffect(() => {
		const getCookie = (name: string) => {
			const value = `; ${document.cookie}`;
			const parts = value.split(`; ${name}=`);
			if (parts.length === 2) return parts.pop()?.split(";").shift();
		};
		const theme = getCookie("theme");
		setIsDark(theme === "dark");
	}, []);
	return isDark;
};

const SearchableMultiSelect = ({
	id,
	options,
	selectedValues,
	onChange,
	placeholder,
	isMultiple = false,
	isDark = false,
}: {
	id?: string;
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
		option.label.toLowerCase().includes(searchTerm.toLowerCase()),
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
			if (selectedValues.length === 1)
				return (
					options.find((opt) => opt.value === selectedValues[0])?.label || ""
				);
			return `${selectedValues.length} öğe seçildi`;
		}
		return options.find((opt) => opt.value === selectedValues[0])?.label || "";
	};
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!(event.target as Element).closest(".searchable-multiselect"))
				setIsOpen(false);
		};
		if (isOpen) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);
	const baseClasses =
		"w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer flex items-center justify-between";
	const lightClasses = "border-gray-300 bg-white text-gray-900";
	const darkClasses = "border-gray-600 bg-gray-800 text-white";
	return (
		<div id={id} className="relative searchable-multiselect">
			<button
				type="button"
				className={`${baseClasses} ${isDark ? darkClasses : lightClasses}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className="flex-1 flex flex-wrap gap-1 text-left">
					{isMultiple && selectedValues.length > 0 ? (
						selectedValues.map((value) => {
							const option = options.find((opt) => opt.value === value);
							return (
								<span
									key={value}
									className={
										"px-2 py-1 rounded text-sm flex items-center gap-1 " +
										(isDark
											? "bg-blue-900 text-blue-200"
											: "bg-blue-100 text-blue-800")
									}
								>
									{option?.label}
									<X
										size={12}
										className="cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											onChange(selectedValues.filter((v) => v !== value));
										}}
									/>
								</span>
							);
						})
					) : (
						<span
							className={
								selectedValues.length === 0
									? isDark
										? "text-gray-400"
										: "text-gray-500"
									: isDark
										? "text-white"
										: "text-gray-900"
							}
						>
							{getDisplayText()}
						</span>
					)}
				</div>
				<ChevronDown
					size={16}
					className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>
			{isOpen && (
				<div
					className={
						"absolute z-50 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-hidden " +
						(isDark
							? "bg-gray-800 border-gray-600"
							: "bg-white border-gray-300")
					}
				>
					<div
						className={`p-2 border-b ${isDark ? "border-gray-600" : "border-gray-200"}`}
					>
						<div className="relative">
							<Search
								size={16}
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							/>
							<input
								type="text"
								placeholder="Ara..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={
									"w-full pl-10 pr-4 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500 " +
									(isDark
										? "border-gray-600 bg-gray-700 text-white"
										: "border-gray-300 bg-white")
								}
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
					</div>
					<div className="max-h-40 overflow-y-auto">
						{filteredOptions.length === 0 ? (
							<div className="p-3 text-center text-gray-500">
								Sonuç bulunamadı
							</div>
						) : (
							filteredOptions.map((option) => (
								<button
									type="button"
									key={option.value}
									className={
										"w-full p-3 cursor-pointer flex items-center gap-2 text-left " +
										(selectedValues.includes(option.value)
											? isDark
												? "bg-blue-900 text-blue-200"
												: "bg-blue-50 text-blue-700"
											: isDark
												? "hover:bg-gray-700 text-white"
												: "hover:bg-gray-50 text-gray-900")
									}
									onClick={() => handleSelect(option.value)}
								>
									{isMultiple && (
										<input
											type="checkbox"
											checked={selectedValues.includes(option.value)}
											readOnly
											className="w-4 h-4 text-blue-600"
										/>
									)}
									<span>{option.label}</span>
								</button>
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

	const { data: usersResponse, isLoading: usersLoading } = useGetWorkspaceUsers(
		{ WorkspaceId: workspaceId },
		{ query: { enabled: isOpen } },
	);
	const {
		mutate: fetchProjects,
		data: projectsResponse,
		isPending: projectsLoading,
	} = usePostApiProjectsList();
	const { mutateAsync: saveTask, isPending: submitLoading } =
		usePostApiWorkspaceTasksSaveorupdate();

	useEffect(() => {
		if (isOpen) {
			fetchProjects({
				data: {
					requireTotalCount: false,
					skip: 0,
					take: 100,
				},
			});
		}
	}, [isOpen, fetchProjects]);

	const userOptions: Option[] = (
		(usersResponse?.data as WorkspaceUserDto[]) || []
	).map((u) => ({
		value: u.id?.toString() || "",
		label: u.email || "", // WorkspaceUserDto'da 'user' alanı yok, email kullanıldı
	}));

	const projectOptions: Option[] = (
		(projectsResponse?.data as { data?: { id?: string; name?: string }[] })
			?.data || []
	).map((p) => ({
		value: p.id?.toString() || "",
		label: p.name || "",
	}));

	const loading = usersLoading || projectsLoading;

	const clearForm = () =>
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

	const handleSubmit = async () => {
		if (
			!formData.title.trim() ||
			!formData.description.trim() ||
			formData.assignees.length === 0
		) {
			alert("Lütfen gerekli alanları doldurunuz.");
			return;
		}
		try {
			await saveTask({
				data: {
					title: formData.title,
					description: formData.description,
					startDate: formData.startDate,
					endDate: formData.dueDate, // WorkspaceTaskDto'da 'dueDate' yerine 'endDate' var
					workspaceId: workspaceId,
				},
			});
			clearForm();
			onClose();
			alert("Görev başarıyla oluşturuldu!");
		} catch (error) {
			console.error(error);
			alert("Bir hata oluştu.");
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);
		setFormData((prev) => ({
			...prev,
			files: [...prev.files, ...selectedFiles],
		}));
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<button
				type="button"
				aria-label="Kapat"
				className="fixed inset-0 bg-black/40 backdrop-blur-sm cursor-default"
				onClick={onClose}
			/>
			<div
				className={
					"relative " +
					(isDark ? "bg-gray-900" : "bg-white") +
					" rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-hidden"
				}
				style={{ zIndex: 10000 }}
			>
				<div
					className={
						"flex items-center justify-between p-6 border-b " +
						(isDark
							? "border-gray-600 bg-gray-800"
							: "border-gray-200 bg-gray-50")
					}
				>
					<h2
						className={
							"text-xl font-semibold " +
							(isDark ? "text-white" : "text-gray-800")
						}
					>
						Görev Oluştur
					</h2>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={onClose}
							className={
								"px-4 py-2 rounded " +
								(isDark
									? "bg-gray-700 text-gray-200"
									: "bg-gray-200 text-gray-700")
							}
						>
							İptal
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={submitLoading || loading}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
						>
							{submitLoading ? "Kaydediliyor..." : "Kaydet"}
						</button>
					</div>
				</div>
				<div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
					<div className="space-y-2">
						<label
							htmlFor="task-title"
							className={
								"block text-sm font-medium px-3 py-2 rounded " +
								(isDark
									? "bg-gray-800 text-gray-300"
									: "bg-gray-100 text-gray-700")
							}
						>
							Görev Başlığı *
						</label>
						<input
							id="task-title"
							type="text"
							value={formData.title}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, title: e.target.value }))
							}
							className={
								"w-full p-3 border rounded-lg outline-none " +
								(isDark
									? "border-gray-600 bg-gray-800 text-white"
									: "border-gray-300 bg-white")
							}
							placeholder="Görev başlığını giriniz"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="task-description"
							className={
								"block text-sm font-medium px-3 py-2 rounded " +
								(isDark
									? "bg-gray-800 text-gray-300"
									: "bg-gray-100 text-gray-700")
							}
						>
							Görev Açıklaması *
						</label>
						<textarea
							id="task-description"
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							rows={4}
							className={
								"w-full p-3 border rounded-lg outline-none resize-none " +
								(isDark
									? "border-gray-600 bg-gray-800 text-white"
									: "border-gray-300 bg-white")
							}
							placeholder="Görev açıklamasını giriniz"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label
								htmlFor="start-date"
								className={
									"block text-sm font-medium px-3 py-2 rounded " +
									(isDark
										? "bg-gray-800 text-gray-300"
										: "bg-gray-100 text-gray-700")
								}
							>
								Başlangıç Tarihi
							</label>
							<input
								id="start-date"
								type="date"
								value={formData.startDate}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										startDate: e.target.value,
									}))
								}
								className={
									"w-full p-3 border rounded-lg outline-none " +
									(isDark
										? "border-gray-600 bg-gray-800 text-white"
										: "border-gray-300 bg-white")
								}
							/>
						</div>
						<div className="space-y-2">
							<label
								htmlFor="due-date"
								className={
									"block text-sm font-medium px-3 py-2 rounded " +
									(isDark
										? "bg-gray-800 text-gray-300"
										: "bg-gray-100 text-gray-700")
								}
							>
								Bitiş Tarihi
							</label>
							<input
								id="due-date"
								type="date"
								value={formData.dueDate}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
								}
								className={
									"w-full p-3 border rounded-lg outline-none " +
									(isDark
										? "border-gray-600 bg-gray-800 text-white"
										: "border-gray-300 bg-white")
								}
							/>
						</div>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="assignees-select"
							className={
								"block text-sm font-medium px-3 py-2 rounded " +
								(isDark
									? "bg-gray-800 text-gray-300"
									: "bg-gray-100 text-gray-700")
							}
						>
							Atanan Kişiler *
						</label>
						<SearchableMultiSelect
							id="assignees-select"
							options={userOptions}
							selectedValues={formData.assignees}
							onChange={(values) =>
								setFormData((prev) => ({ ...prev, assignees: values }))
							}
							placeholder="Atanacak kişileri seçiniz"
							isMultiple={true}
							isDark={isDark}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label
								htmlFor="supervisors-select"
								className={
									"block text-sm font-medium px-3 py-2 rounded " +
									(isDark
										? "bg-gray-800 text-gray-300"
										: "bg-gray-100 text-gray-700")
								}
							>
								Gözetmenler
							</label>
							<SearchableMultiSelect
								id="supervisors-select"
								options={userOptions}
								selectedValues={formData.supervisors}
								onChange={(values) =>
									setFormData((prev) => ({ ...prev, supervisors: values }))
								}
								placeholder="Gözetmenleri seçiniz"
								isMultiple={true}
								isDark={isDark}
							/>
						</div>
						<div className="space-y-2">
							<label
								htmlFor="projects-select"
								className={
									"block text-sm font-medium px-3 py-2 rounded " +
									(isDark
										? "bg-gray-800 text-gray-300"
										: "bg-gray-100 text-gray-700")
								}
							>
								Projeler
							</label>
							<SearchableMultiSelect
								id="projects-select"
								options={projectOptions}
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
					<div className="space-y-2">
						<label
							htmlFor="file-upload"
							className={
								"block text-sm font-medium px-3 py-2 rounded " +
								(isDark
									? "bg-gray-800 text-gray-300"
									: "bg-gray-100 text-gray-700")
							}
						>
							Dosya Ekle
						</label>
						<div
							className={
								"border-2 border-dashed rounded-lg p-6 text-center " +
								(isDark ? "border-gray-600" : "border-gray-300")
							}
						>
							<input
								type="file"
								multiple
								onChange={handleFileChange}
								className="hidden"
								id="file-upload"
							/>
							<div className="cursor-pointer text-gray-500">
								Tıklayın veya dosya sürükleyin
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
