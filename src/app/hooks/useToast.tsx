"use client";

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";
import { useTheme } from "../contexts/ThemeContext";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
}

interface ToastContextType {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
	clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const addToast = useCallback(
		(toast: Omit<Toast, "id">) => {
			const id = Math.random().toString(36).substr(2, 9);
			const newToast: Toast = {
				...toast,
				id,
				duration: toast.duration || 5000,
			};

			setToasts((prev) => [...prev, newToast]);

			// Auto remove toast after duration
			if (newToast.duration && newToast.duration > 0) {
				setTimeout(() => {
					removeToast(id);
				}, newToast.duration);
			}
		},
		[removeToast],
	);

	const clearAllToasts = useCallback(() => {
		setToasts([]);
	}, []);

	return (
		<ToastContext.Provider
			value={{ toasts, addToast, removeToast, clearAllToasts }}
		>
			{children}
			<ToastContainer />
		</ToastContext.Provider>
	);
}

function ToastContainer() {
	const context = useContext(ToastContext);
	if (!context) return null;

	const { toasts, removeToast } = context;

	if (toasts.length === 0) return null;

	return (
		<div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full">
			{toasts.map((toast) => (
				<ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
			))}
		</div>
	);
}

function ToastItem({
	toast,
	onRemove,
}: {
	toast: Toast;
	onRemove: (id: string) => void;
}) {
	const { theme } = useTheme();

	const getIcon = () => {
		switch (toast.type) {
			case "success":
				return <CheckCircle className="w-5 h-5 text-green-500" />;
			case "error":
				return <AlertCircle className="w-5 h-5 text-red-500" />;
			case "warning":
				return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
			case "info":
				return <Info className="w-5 h-5 text-blue-500" />;
			default:
				return <Info className="w-5 h-5 text-blue-500" />;
		}
	};

	const getBorderColor = () => {
		switch (toast.type) {
			case "success":
				return "border-l-green-500";
			case "error":
				return "border-l-red-500";
			case "warning":
				return "border-l-yellow-500";
			case "info":
				return "border-l-blue-500";
			default:
				return "border-l-blue-500";
		}
	};

	return (
		<div
			className={`
        relative overflow-hidden rounded-xl border-l-4 ${getBorderColor()} 
        backdrop-blur-sm shadow-lg transform transition-all duration-300 
        animate-in slide-in-from-right-full
        ${
					theme === "dark"
						? "bg-gray-800/95 border-gray-700/50 shadow-2xl"
						: "bg-white/95 border-gray-200/50 shadow-xl"
				}
      `}
		>
			<div className="p-4">
				<div className="flex items-start gap-3">
					<div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

					<div className="flex-1 min-w-0">
						<h4
							className={`text-sm font-semibold ${
								theme === "dark" ? "text-white" : "text-gray-900"
							}`}
						>
							{toast.title}
						</h4>

						{toast.message && (
							<p
								className={`text-xs mt-1 ${
									theme === "dark" ? "text-gray-300" : "text-gray-600"
								}`}
							>
								{toast.message}
							</p>
						)}

						{toast.action && (
							<button
								type="button"
								onClick={toast.action.onClick}
								className={`text-xs mt-2 font-medium transition-colors ${
									toast.type === "success"
										? "text-green-600 hover:text-green-700"
										: toast.type === "error"
											? "text-red-600 hover:text-red-700"
											: toast.type === "warning"
												? "text-yellow-600 hover:text-yellow-700"
												: "text-blue-600 hover:text-blue-700"
								}`}
							>
								{toast.action.label}
							</button>
						)}
					</div>

					<button
						type="button"
						onClick={() => onRemove(toast.id)}
						className={`flex-shrink-0 p-1 rounded-full transition-colors ${
							theme === "dark"
								? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
								: "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
						}`}
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Progress bar */}
			{toast.duration && toast.duration > 0 && (
				<div
					className={`absolute bottom-0 left-0 h-1 ${
						toast.type === "success"
							? "bg-green-500"
							: toast.type === "error"
								? "bg-red-500"
								: toast.type === "warning"
									? "bg-yellow-500"
									: "bg-blue-500"
					} animate-pulse`}
					style={{
						width: "100%",
						animation: `shrink ${toast.duration}ms linear forwards`,
					}}
				/>
			)}
		</div>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}

	const { addToast, removeToast, clearAllToasts } = context;

	// Convenience methods
	const success = useCallback(
		(title: string, message?: string, options?: Partial<Toast>) => {
			addToast({ type: "success", title, message, ...options });
		},
		[addToast],
	);

	const error = useCallback(
		(title: string, message?: string, options?: Partial<Toast>) => {
			addToast({ type: "error", title, message, ...options });
		},
		[addToast],
	);

	const warning = useCallback(
		(title: string, message?: string, options?: Partial<Toast>) => {
			addToast({ type: "warning", title, message, ...options });
		},
		[addToast],
	);

	const info = useCallback(
		(title: string, message?: string, options?: Partial<Toast>) => {
			addToast({ type: "info", title, message, ...options });
		},
		[addToast],
	);

	// CRUD operation helpers
	const created = useCallback(
		(item: string, message?: string) => {
			success(
				`${item} Oluşturuldu`,
				message || `${item} başarıyla oluşturuldu.`,
			);
		},
		[success],
	);

	const updated = useCallback(
		(item: string, message?: string) => {
			success(
				`${item} Güncellendi`,
				message || `${item} başarıyla güncellendi.`,
			);
		},
		[success],
	);

	const deleted = useCallback(
		(item: string, message?: string) => {
			success(`${item} Silindi`, message || `${item} başarıyla silindi.`);
		},
		[success],
	);

	const saved = useCallback(
		(item: string, message?: string) => {
			success(`${item} Kaydedildi`, message || `${item} başarıyla kaydedildi.`);
		},
		[success],
	);

	return {
		success,
		error,
		warning,
		info,
		created,
		updated,
		deleted,
		saved,
		remove: removeToast,
		clearAll: clearAllToasts,
	};
}
