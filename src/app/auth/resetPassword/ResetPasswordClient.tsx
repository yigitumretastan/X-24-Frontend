"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { usePostApiUsersResetPassword } from "@/api/generated/users/users";
import type { ResetPasswordRequest as GeneratedResetPasswordRequest } from "@/api/model/resetPasswordRequest";
import {
	authValidationRules,
	useFormValidation,
} from "@/app/hooks/useFormValidation";

interface ResetFormData extends Record<string, unknown> {
	password: string;
	confirmPassword: string;
}

export default function ResetPasswordClient() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const token = searchParams.get("token") || "";
	const email = searchParams.get("email") || "";

	const [error, setError] = useState("");
	const [showPasswords, setShowPasswords] = useState(false);

	const { mutateAsync: resetPasswordMutation } = usePostApiUsersResetPassword();

	// Form validation hook
	const {
		values,
		errors,
		isSubmitting,
		handleChange,
		handleSubmit,
		setFieldError,
	} = useFormValidation<ResetFormData>(
		{ password: "", confirmPassword: "" },
		authValidationRules.resetPasswordRules,
	);

	const onResetPasswordSubmit = async (formValues: ResetFormData) => {
		setError("");

		// Check password confirmation
		if (formValues.password !== formValues.confirmPassword) {
			setFieldError("confirmPassword", "Şifreler eşleşmiyor.");
			return;
		}

		const resetData: GeneratedResetPasswordRequest = {
			email,
			resetCode: token,
			newPassword: formValues.password,
		};

		try {
			await resetPasswordMutation({ data: resetData });
			router.push("/auth/login?reset=success");
		} catch (error: unknown) {
			let errorMessage = "Bir hata oluştu";
			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data?.message || errorMessage;
			}
			setError(errorMessage);
		}
	};

	return (
		<main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
			<div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center text-black">
				<h1 className="text-3xl font-extrabold mb-4">Şifre Sıfırlama</h1>
				{error && <p className="text-red-600 mb-4">{error}</p>}

				<form
					onSubmit={handleSubmit(onResetPasswordSubmit)}
					className="flex flex-col gap-4"
				>
					{errors.password && (
						<p className="text-sm text-red-600">{errors.password}</p>
					)}
					<div className="relative">
						<input
							type={showPasswords ? "text" : "password"}
							placeholder="Yeni Şifre"
							value={values.password}
							onChange={(e) => handleChange("password", e.target.value)}
							disabled={isSubmitting}
							className="border border-gray-300 rounded-md p-3 w-full text-black"
						/>
					</div>

					{errors.confirmPassword && (
						<p className="text-sm text-red-600">{errors.confirmPassword}</p>
					)}
					<div className="relative">
						<input
							type={showPasswords ? "text" : "password"}
							placeholder="Yeni Şifre Tekrar"
							value={values.confirmPassword}
							onChange={(e) => handleChange("confirmPassword", e.target.value)}
							disabled={isSubmitting}
							className="border border-gray-300 rounded-md p-3 w-full text-black"
						/>
						<button
							type="button"
							onClick={() => setShowPasswords(!showPasswords)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
						>
							{showPasswords ? (
								<AiOutlineEyeInvisible size={20} />
							) : (
								<AiOutlineEye size={20} />
							)}
						</button>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
					>
						{isSubmitting ? "Şifre Sıfırlanıyor..." : "Şifreyi Sıfırla"}
					</button>
				</form>
			</div>
		</main>
	);
}
