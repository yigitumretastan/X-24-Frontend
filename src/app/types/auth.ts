// Auth ile ilgili tüm type'lar

export interface User {
	id: string;
	name: string;
	lastName: string;
	email: string;
	phone?: string | null;
	avatar?: string;
	role?: string;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

// Login
export interface LoginRequest extends Record<string, unknown> {
	email: string;
	phone: string;
	password: string;
	twoFactorCode?: string;
}

export interface LoginResponse {
	token?: string;
	message?: string;
	twoFactorRequired?: boolean;
	user?: User;
}

// Register
export interface RegisterRequest extends Record<string, unknown> {
	name: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
	confirmPassword: string;
}

export interface RegisterResponse {
	token: string;
	id: string;
	name: string;
	lastName: string;
	email: string;
	phone?: string;
}

// Reset Password
export interface ResetPasswordRequest extends Record<string, unknown> {
	email: string;
	token: string;
	newPassword: string;
	confirmPassword: string;
}

export interface ResetPasswordResponse {
	message: string;
	success: boolean;
}

// Form Validation
export interface ValidationRule {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	custom?: (value: string) => string | null;
}

export interface ValidationRules {
	[key: string]: ValidationRule;
}

export interface FormErrors {
	[key: string]: string;
}

// API Error
export interface ApiError {
	message: string;
	status?: number;
	field?: string;
}
