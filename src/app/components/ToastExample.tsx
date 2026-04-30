"use client";

import { useToast } from "@/app/hooks/useToast";

export default function ToastExample() {
	const toast = useToast();

	const handleSuccess = () => {
		toast.success("İşlem Başarılı!", "Veriler başarıyla kaydedildi.");
	};

	const handleError = () => {
		toast.error(
			"Hata Oluştu!",
			"Bir şeyler yanlış gitti. Lütfen tekrar deneyin.",
		);
	};

	const handleWarning = () => {
		toast.warning("Uyarı!", "Bu işlem geri alınamaz. Emin misiniz?");
	};

	const handleInfo = () => {
		toast.info("Bilgi", "Yeni bir güncelleme mevcut.");
	};

	// CRUD işlemleri için özel metodlar
	const handleCreated = () => {
		toast.created("Proje", "Yeni proje başarıyla oluşturuldu.");
	};

	const handleUpdated = () => {
		toast.updated("Kullanıcı Profili", "Profil bilgileriniz güncellendi.");
	};

	const handleDeleted = () => {
		toast.deleted("Görev", "Görev listeden kaldırıldı.");
	};

	const handleSaved = () => {
		toast.saved("Ayarlar", "Tüm ayarlarınız kaydedildi.");
	};

	const handleWithAction = () => {
		toast.info("Dosya Yüklendi", "Dosyanız işleniyor...", {
			duration: 0, // Manuel olarak kapatılacak
			action: {
				label: "Görüntüle",
				onClick: () => {
					alert("Dosya görüntüleniyor...");
				},
			},
		});
	};

	return (
		<div className="p-6 space-y-4">
			<h2 className="text-xl font-bold mb-4">Toast Notification Örnekleri</h2>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				<button
					type="button"
					onClick={handleSuccess}
					className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
				>
					Başarılı
				</button>

				<button
					type="button"
					onClick={handleError}
					className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
				>
					Hata
				</button>

				<button
					type="button"
					onClick={handleWarning}
					className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
				>
					Uyarı
				</button>

				<button
					type="button"
					onClick={handleInfo}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
				>
					Bilgi
				</button>
			</div>

			<div className="border-t pt-4">
				<h3 className="text-lg font-semibold mb-3">CRUD İşlemleri</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					<button
						type="button"
						onClick={handleCreated}
						className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
					>
						Oluşturuldu
					</button>

					<button
						type="button"
						onClick={handleUpdated}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						Güncellendi
					</button>

					<button
						type="button"
						onClick={handleDeleted}
						className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
					>
						Silindi
					</button>

					<button
						type="button"
						onClick={handleSaved}
						className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
					>
						Kaydedildi
					</button>
				</div>
			</div>

			<div className="border-t pt-4">
				<h3 className="text-lg font-semibold mb-3">Özel Özellikler</h3>
				<button
					type="button"
					onClick={handleWithAction}
					className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
				>
					Aksiyon Butonlu Toast
				</button>
			</div>

			<div className="border-t pt-4">
				<button
					type="button"
					onClick={() => toast.clearAll()}
					className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
				>
					Tüm Bildirimleri Temizle
				</button>
			</div>
		</div>
	);
}
