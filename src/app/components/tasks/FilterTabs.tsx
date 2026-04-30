// components/FilterTabs.tsx
import type React from "react";

interface FilterTabsProps {
	activeFilter: string;
	onFilterChange: (key: string) => void;
	filters: { key: string; name: string }[];
	theme: "light" | "dark";
}

const FilterTabs: React.FC<FilterTabsProps> = ({
	activeFilter,
	onFilterChange,
	filters,
	theme,
}) => {
	return (
		<div className="mb-8">
			<div
				className={`flex flex-wrap gap-3 p-2 rounded-3xl backdrop-blur-sm ${
					theme === "dark"
						? "bg-gray-800/30 border border-gray-700/50"
						: "bg-white/60 border border-gray-200/50"
				}`}
			>
				{filters.map((filter, index) => (
					<button
						type="button"
						key={filter.key}
						onClick={() => onFilterChange(filter.key)}
						className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
							activeFilter === filter.key
								? theme === "dark"
									? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
									: "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
								: theme === "dark"
									? "bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-600/50 hover:border-gray-500/50"
									: "bg-white/80 text-gray-700 border border-gray-300/50 hover:bg-gray-50/80 hover:border-gray-400/50"
						}`}
						style={{ animationDelay: `${index * 50}ms` }}
					>
						{activeFilter === filter.key && (
							<>
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-100"></div>
								<div
									className={`absolute -inset-1 rounded-2xl blur-sm ${
										theme === "dark"
											? "bg-gradient-to-r from-blue-600/50 to-purple-600/50"
											: "bg-gradient-to-r from-blue-500/50 to-purple-500/50"
									} opacity-60`}
								></div>
							</>
						)}
						<span className="relative z-10 flex items-center space-x-2">
							<span>{filter.name}</span>
							{activeFilter === filter.key && (
								<div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
							)}
						</span>
					</button>
				))}
			</div>

			{/* Active filter indicator */}
			<div
				className={`mt-4 flex items-center space-x-2 text-sm ${
					theme === "dark" ? "text-gray-400" : "text-gray-600"
				}`}
			>
				<div
					className={`w-2 h-2 rounded-full ${
						theme === "dark" ? "bg-blue-400" : "bg-blue-500"
					} animate-pulse`}
				></div>
				<span>
					Aktif filtre:{" "}
					<span className="font-semibold">
						{filters.find((f) => f.key === activeFilter)?.name || "Tümü"}
					</span>
				</span>
			</div>
		</div>
	);
};

export default FilterTabs;
