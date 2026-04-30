import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://zeniva.com";
	const currentDate = new Date().toISOString();

	return [
		// Ana Sayfa
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 1.0,
		},

		// Kimlik Doğrulama Sayfaları
		{
			url: `${baseUrl}/auth/login`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/auth/register`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/auth/resetPassword`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.5,
		},

		// Dashboard Ana Sayfa
		{
			url: `${baseUrl}/dashboard`,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 0.9,
		},

		// Dashboard Alt Sayfaları
		{
			url: `${baseUrl}/dashboard/analysis`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/dashboard/calender`,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/dashboard/disk`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/dashboard/messages`,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/dashboard/projects`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/dashboard/reports`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/dashboard/settings`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/dashboard/tasks`,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 0.8,
		},

		// Çalışma Alanları
		{
			url: `${baseUrl}/workspaces`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.7,
		},
	];
}
