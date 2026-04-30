import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: [
					"/",
					"/auth/login",
					"/auth/register",
					"/feed.xml",
					"/feed.json",
				],
				disallow: ["/auth/callback", "/auth/resetPassword", "/dashboard/test"],
			},
		],
		sitemap: "https://zeniva.com/sitemap.xml",
	};
}
