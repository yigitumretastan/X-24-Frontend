import { NextResponse } from "next/server";

export async function GET() {
	const baseUrl = "https://zeniva.com";
	const currentDate = new Date().toISOString();

	const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Zeniva - Proje Yönetim Platformu</title>
    <description>Zeniva ile projelerinizi yönetin, takımınızla işbirliği yapın ve verimliliğinizi artırın.</description>
    <link>${baseUrl}</link>
    <language>tr-TR</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Zeniva RSS Generator</generator>
    <webMaster>admin@zeniva.com (Zeniva Admin)</webMaster>
    <managingEditor>admin@zeniva.com (Zeniva Admin)</managingEditor>
    <copyright>© 2024 Zeniva. Tüm hakları saklıdır.</copyright>
    <category>Proje Yönetimi</category>
    <category>İşbirliği</category>
    <category>Verimlilik</category>

    <!-- Platform Güncellemeleri -->
    <item>
      <title>Zeniva Dashboard Yenilendi</title>
      <description>Yeni dashboard tasarımı ile projelerinizi daha kolay yönetin. Gelişmiş analiz araçları ve kullanıcı dostu arayüz.</description>
      <link>${baseUrl}/dashboard</link>
      <guid>${baseUrl}/dashboard</guid>
      <pubDate>${currentDate}</pubDate>
      <category>Platform Güncellemesi</category>
    </item>

    <item>
      <title>Proje Yönetimi Özellikleri</title>
      <description>Zeniva ile projelerinizi baştan sona yönetin. Görev atama, ilerleme takibi ve takım işbirliği.</description>
      <link>${baseUrl}/dashboard/projects</link>
      <guid>${baseUrl}/dashboard/projects</guid>
      <pubDate>${currentDate}</pubDate>
      <category>Özellikler</category>
    </item>

    <item>
      <title>Gelişmiş Görev Yönetimi</title>
      <description>Görevlerinizi organize edin, öncelik belirleyin ve takım üyelerinizle paylaşın.</description>
      <link>${baseUrl}/dashboard/tasks</link>
      <guid>${baseUrl}/dashboard/tasks</guid>
      <pubDate>${currentDate}</pubDate>
      <category>Görev Yönetimi</category>
    </item>

    <item>
      <title>Takvim ve Planlama</title>
      <description>Entegre takvim sistemi ile toplantılarınızı ve önemli tarihlerinizi takip edin.</description>
      <link>${baseUrl}/dashboard/calender</link>
      <guid>${baseUrl}/dashboard/calender</guid>
      <pubDate>${currentDate}</pubDate>
      <category>Planlama</category>
    </item>

    <item>
      <title>Dosya Yönetimi ve Paylaşım</title>
      <description>Projelerinizle ilgili dosyaları güvenli bir şekilde saklayın ve takımınızla paylaşın.</description>
      <link>${baseUrl}/dashboard/disk</link>
      <guid>${baseUrl}/dashboard/disk</guid>
      <pubDate>${currentDate}</pubDate>
      <category>Dosya Yönetimi</category>
    </item>

    <item>
      <title>Detaylı Raporlama</title>
      <description>Proje ilerlemesi, takım performansı ve verimlilik raporları ile işinizi analiz edin.</description>
      <link>${baseUrl}/dashboard/reports</link>
      <guid>${baseUrl}/dashboard/reports</guid>
      <pubDate>${currentDate}</pubDate>
      <category>Raporlama</category>
    </item>

    <item>
      <title>Anlık Mesajlaşma</title>
      <description>Takım üyelerinizle anlık mesajlaşma özelliği ile hızlı iletişim kurun.</description>
      <link>${baseUrl}/dashboard/messages</link>
      <guid>${baseUrl}/dashboard/messages</guid>
      <pubDate>${currentDate}</pubDate>
      <category>İletişim</category>
    </item>

    <item>
      <title>Veri Analizi ve İstatistikler</title>
      <description>Projelerinizin performansını analiz edin ve veri odaklı kararlar alın.</description>
      <link>${baseUrl}/dashboard/analysis</link>
      <guid>${baseUrl}/dashboard/analysis</guid>
      <pubDate>${currentDate}</pubDate>
      <category>Analiz</category>
    </item>

  </channel>
</rss>`;

	return new NextResponse(rssXml, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	});
}
