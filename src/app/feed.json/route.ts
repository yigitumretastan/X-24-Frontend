import { NextResponse } from "next/server";

export async function GET() {
	const baseUrl = "https://zeniva.com";
	const currentDate = new Date().toISOString();

	const jsonFeed = {
		version: "https://jsonfeed.org/version/1.1",
		title: "Zeniva - Proje Yönetim Platformu",
		description:
			"Zeniva ile projelerinizi yönetin, takımınızla işbirliği yapın ve verimliliğinizi artırın.",
		home_page_url: baseUrl,
		feed_url: `${baseUrl}/feed.json`,
		language: "tr-TR",
		favicon: `${baseUrl}/favicon.ico`,
		authors: [
			{
				name: "Zeniva Team",
				url: baseUrl,
				avatar: `${baseUrl}/logo.png`,
			},
		],
		items: [
			{
				id: `${baseUrl}/dashboard`,
				title: "Zeniva Dashboard Yenilendi",
				content_html:
					"<p>Yeni dashboard tasarımı ile projelerinizi daha kolay yönetin. Gelişmiş analiz araçları ve kullanıcı dostu arayüz.</p>",
				content_text:
					"Yeni dashboard tasarımı ile projelerinizi daha kolay yönetin. Gelişmiş analiz araçları ve kullanıcı dostu arayüz.",
				url: `${baseUrl}/dashboard`,
				date_published: currentDate,
				tags: ["Platform Güncellemesi", "Dashboard"],
			},
			{
				id: `${baseUrl}/dashboard/projects`,
				title: "Proje Yönetimi Özellikleri",
				content_html:
					"<p>Zeniva ile projelerinizi baştan sona yönetin. Görev atama, ilerleme takibi ve takım işbirliği.</p>",
				content_text:
					"Zeniva ile projelerinizi baştan sona yönetin. Görev atama, ilerleme takibi ve takım işbirliği.",
				url: `${baseUrl}/dashboard/projects`,
				date_published: currentDate,
				tags: ["Özellikler", "Proje Yönetimi"],
			},
			{
				id: `${baseUrl}/dashboard/tasks`,
				title: "Gelişmiş Görev Yönetimi",
				content_html:
					"<p>Görevlerinizi organize edin, öncelik belirleyin ve takım üyelerinizle paylaşın.</p>",
				content_text:
					"Görevlerinizi organize edin, öncelik belirleyin ve takım üyelerinizle paylaşın.",
				url: `${baseUrl}/dashboard/tasks`,
				date_published: currentDate,
				tags: ["Görev Yönetimi", "Organizasyon"],
			},
			{
				id: `${baseUrl}/dashboard/calender`,
				title: "Takvim ve Planlama",
				content_html:
					"<p>Entegre takvim sistemi ile toplantılarınızı ve önemli tarihlerinizi takip edin.</p>",
				content_text:
					"Entegre takvim sistemi ile toplantılarınızı ve önemli tarihlerinizi takip edin.",
				url: `${baseUrl}/dashboard/calender`,
				date_published: currentDate,
				tags: ["Planlama", "Takvim"],
			},
			{
				id: `${baseUrl}/dashboard/disk`,
				title: "Dosya Yönetimi ve Paylaşım",
				content_html:
					"<p>Projelerinizle ilgili dosyaları güvenli bir şekilde saklayın ve takımınızla paylaşın.</p>",
				content_text:
					"Projelerinizle ilgili dosyaları güvenli bir şekilde saklayın ve takımınızla paylaşın.",
				url: `${baseUrl}/dashboard/disk`,
				date_published: currentDate,
				tags: ["Dosya Yönetimi", "Paylaşım"],
			},
			{
				id: `${baseUrl}/dashboard/reports`,
				title: "Detaylı Raporlama",
				content_html:
					"<p>Proje ilerlemesi, takım performansı ve verimlilik raporları ile işinizi analiz edin.</p>",
				content_text:
					"Proje ilerlemesi, takım performansı ve verimlilik raporları ile işinizi analiz edin.",
				url: `${baseUrl}/dashboard/reports`,
				date_published: currentDate,
				tags: ["Raporlama", "Analiz"],
			},
			{
				id: `${baseUrl}/dashboard/messages`,
				title: "Anlık Mesajlaşma",
				content_html:
					"<p>Takım üyelerinizle anlık mesajlaşma özelliği ile hızlı iletişim kurun.</p>",
				content_text:
					"Takım üyelerinizle anlık mesajlaşma özelliği ile hızlı iletişim kurun.",
				url: `${baseUrl}/dashboard/messages`,
				date_published: currentDate,
				tags: ["İletişim", "Mesajlaşma"],
			},
			{
				id: `${baseUrl}/dashboard/analysis`,
				title: "Veri Analizi ve İstatistikler",
				content_html:
					"<p>Projelerinizin performansını analiz edin ve veri odaklı kararlar alın.</p>",
				content_text:
					"Projelerinizin performansını analiz edin ve veri odaklı kararlar alın.",
				url: `${baseUrl}/dashboard/analysis`,
				date_published: currentDate,
				tags: ["Analiz", "İstatistik"],
			},
		],
	};

	return NextResponse.json(jsonFeed, {
		headers: {
			"Content-Type": "application/feed+json; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	});
}
