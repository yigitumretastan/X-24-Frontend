// components/FilterTabs.tsx
import React from "react";

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (key: string) => void;
  filters: { key: string; name: string }[];
  theme: "light" | "dark"; 
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange, filters, theme }) => {
  return (
    <div className={`flex gap-2 mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-6 py-2 rounded-xl font-medium transition ${
            activeFilter === filter.key
              ? theme === "dark"
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white"
              : theme === "dark"
              ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {filter.name}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
