import { useTheme } from "@/app/hooks/useTheme";

export default function DataSettings() {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-semibold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Veri Yönetimi
        </h2>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Verilerinizi yönetin, dışa aktarın veya silin
        </p>
      </div>
      
      <div className={`p-6 rounded-xl border ${
        theme === 'dark' 
          ? 'bg-gray-900/50 border-gray-700/50' 
          : 'bg-gray-50/50 border-gray-200/50'
      }`}>
        <p className={`text-center ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Veri yönetimi araçları yakında eklenecek...
        </p>
      </div>
    </div>
  );
}
