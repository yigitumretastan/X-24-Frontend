import React from "react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const inviteCode = `https://X-24.com/invite/12345`; 

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      alert("Davet linki kopyalandı!");
    } catch {
      alert("Kopyalama işlemi başarısız oldu.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-300 rounded-[20px] shadow-lg z-50 text-black">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Kullanıcı Davet Edin</h2>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            readOnly
            value={inviteCode}
            className="flex-1 px-3 py-2 border rounded-md text-sm text-gray-700"
          />
          <button
            onClick={handleCopy}
            title="Kopyala"
            className="px-2 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            📋
          </button>
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
