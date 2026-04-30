import axios, {
	type AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import { deleteCookie, getCookie } from "@/app/utils/cookies";

// API Base URL - backend URL
export const API_BASE_URL = "https://localhost:7166";

export const AXIOS_INSTANCE = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// Request interceptor
AXIOS_INSTANCE.interceptors.request.use(
	(config) => {
		const token = getCookie("userToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		if (config.url?.startsWith("/api/")) {
			config.headers["X-API-Request"] = "true";
			config.headers["X-Request-Type"] = "API";
		}

		return config;
	},
	(error) => Promise.reject(error),
);

// Response interceptor
AXIOS_INSTANCE.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			deleteCookie("userToken");
			deleteCookie("userData");
			if (typeof window !== "undefined") {
				window.location.href = "/auth/login";
			}
		}
		return Promise.reject(error);
	},
);

// Orval mutator
export const customInstance = <T>(
	url: string | AxiosRequestConfig,
	config?: AxiosRequestConfig,
): Promise<T> => {
	const source = axios.CancelToken.source();

	// Orval'dan gelen headers yapısını Axios'un anlayacağı hale getir
	const headers = config?.headers
		? config.headers instanceof Headers
			? Object.fromEntries(config.headers.entries())
			: config.headers
		: {};

	const axiosConfig: AxiosRequestConfig =
		typeof url === "string"
			? { ...config, url, headers }
			: { ...url, ...config, headers: { ...url.headers, ...headers } };

	const promise = AXIOS_INSTANCE({
		...axiosConfig,
		cancelToken: source.token,
	}).then(({ data }) => data);

	// @ts-expect-error - Orval requires a cancel method on the promise
	promise.cancel = () => {
		source.cancel("Query was cancelled");
	};

	return promise;
};

export default customInstance;
