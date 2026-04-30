"use client";

import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Italic,
	Paperclip,
	Save,
	Send,
	Underline,
	Upload,
	X,
} from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";

interface ReportEditorProps {
	subject: string;
	setSubject: (value: string) => void;
	content: string;
	setContent: (value: string) => void;
	attachments: File[];
	fileInputRef: React.RefObject<HTMLInputElement>;
	contentRef: React.RefObject<HTMLDivElement>;
	handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
	removeAttachment: (index: number) => void;
	formatText: (command: string, value?: string) => void;
	handleSaveDraft: () => void;
	handleSendReport: () => void;
}

export default function ReportEditor({
	subject,
	setSubject,
	setContent,
	attachments,
	fileInputRef,
	contentRef,
	handleFileUpload,
	removeAttachment,
	formatText,
	handleSaveDraft,
	handleSendReport,
}: ReportEditorProps) {
	const { theme } = useTheme();

	return (
		<div className="space-y-4">
			<h3
				className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
			>
				📝 Yeni Rapor
			</h3>

			{/* Konu */}
			<div>
				<input
					type="text"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					placeholder="Rapor konusu..."
					className={`w-full px-4 py-3 rounded-xl border transition-colors ${
						theme === "dark"
							? "bg-gray-700/50 border-gray-600 text-white focus:border-red-500"
							: "bg-white border-gray-300 text-gray-900 focus:border-red-500"
					} focus:outline-none focus:ring-2 focus:ring-red-500/20`}
				/>
			</div>

			{/* Rich Text Toolbar */}
			<div
				className={`flex flex-wrap items-center gap-2 p-3 rounded-xl border ${
					theme === "dark"
						? "bg-gray-700/30 border-gray-600"
						: "bg-gray-50 border-gray-300"
				}`}
			>
				<button
					type="button"
					onClick={() => formatText("bold")}
					className={`p-2 rounded-lg transition-colors ${
						theme === "dark"
							? "hover:bg-gray-600 text-gray-300"
							: "hover:bg-gray-200 text-gray-600"
					}`}
				>
					<Bold className="w-4 h-4" />
				</button>
				<button
					type="button"
					onClick={() => formatText("italic")}
					className={`p-2 rounded-lg transition-colors ${
						theme === "dark"
							? "hover:bg-gray-600 text-gray-300"
							: "hover:bg-gray-200 text-gray-600"
					}`}
				>
					<Italic className="w-4 h-4" />
				</button>
				<button
					type="button"
					onClick={() => formatText("underline")}
					className={`p-2 rounded-lg transition-colors ${
						theme === "dark"
							? "hover:bg-gray-600 text-gray-300"
							: "hover:bg-gray-200 text-gray-600"
					}`}
				>
					<Underline className="w-4 h-4" />
				</button>
				<div
					className={`w-px h-6 ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}
				></div>
				<button
					type="button"
					onClick={() => formatText("justifyLeft")}
					className={`p-2 rounded-lg transition-colors ${
						theme === "dark"
							? "hover:bg-gray-600 text-gray-300"
							: "hover:bg-gray-200 text-gray-600"
					}`}
				>
					<AlignLeft className="w-4 h-4" />
				</button>
				<button
					type="button"
					onClick={() => formatText("justifyCenter")}
					className={`p-2 rounded-lg transition-colors ${
						theme === "dark"
							? "hover:bg-gray-600 text-gray-300"
							: "hover:bg-gray-200 text-gray-600"
					}`}
				>
					<AlignCenter className="w-4 h-4" />
				</button>
				<button
					type="button"
					onClick={() => formatText("justifyRight")}
					className={`p-2 rounded-lg transition-colors ${
						theme === "dark"
							? "hover:bg-gray-600 text-gray-300"
							: "hover:bg-gray-200 text-gray-600"
					}`}
				>
					<AlignRight className="w-4 h-4" />
				</button>
			</div>

			{/* Content Editor */}
			<div
				ref={contentRef}
				contentEditable
				onInput={(e) => setContent(e.currentTarget.innerHTML)}
				className={`min-h-[200px] p-4 rounded-xl border focus:outline-none ${
					theme === "dark"
						? "bg-gray-700/50 border-gray-600 text-white"
						: "bg-white border-gray-300 text-gray-900"
				}`}
				style={{ wordWrap: "break-word" }}
				data-placeholder="Rapor içeriğinizi buraya yazın..."
			/>

			{/* Dosya Ekleme */}
			<div>
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-dashed transition-colors ${
						theme === "dark"
							? "border-gray-600 hover:border-red-500 text-gray-300"
							: "border-gray-300 hover:border-red-500 text-gray-600"
					}`}
				>
					<Upload className="w-4 h-4" />
					<span className="text-sm">Dosya Ekle</span>
				</button>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					onChange={handleFileUpload}
					className="hidden"
				/>

				{attachments.length > 0 && (
					<div className="mt-2 space-y-1">
						{attachments.map((file, index) => (
							<div
								key={`${file.name}-${file.size}-${file.lastModified}`}
								className={`flex items-center justify-between p-2 rounded-lg ${
									theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
								}`}
							>
								<div className="flex items-center space-x-2">
									<Paperclip className="w-3 h-3 text-gray-500" />
									<span
										className={`text-xs ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}
									>
										{file.name}
									</span>
								</div>
								<button
									type="button"
									onClick={() => removeAttachment(index)}
									className="p-1 rounded text-red-500 hover:bg-red-500/10"
								>
									<X className="w-3 h-3" />
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className="flex items-center justify-end space-x-3 pt-4">
				<button
					type="button"
					onClick={handleSaveDraft}
					className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
						theme === "dark"
							? "bg-gray-700 text-gray-300 hover:bg-gray-600"
							: "bg-gray-100 text-gray-700 hover:bg-gray-200"
					}`}
				>
					<Save className="w-4 h-4" />
					<span>Taslak</span>
				</button>
				<button
					type="button"
					onClick={handleSendReport}
					className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
				>
					<Send className="w-4 h-4" />
					<span>Gönder</span>
				</button>
			</div>
		</div>
	);
}
