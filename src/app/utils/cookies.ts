import Cookies from "js-cookie";

export function getCookie(name: string): string | null {
	return Cookies.get(name) || null;
}

export function setCookie(name: string, value: string, days = 1): void {
	Cookies.set(name, value, {
		expires: days,
		path: "/",
		sameSite: "Strict",
		secure: true,
	});
}

export function deleteCookie(name: string): void {
	Cookies.remove(name, { path: "/" });
}
