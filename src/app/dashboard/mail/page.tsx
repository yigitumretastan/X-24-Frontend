"use client";

import AuthGuard from "@/app/components/AuthGuard";
import MailComponent from "@/app/components/mail/MailComponent";

export default function MailPage() {
	return (
		<AuthGuard>
			<div className="h-[calc(100vh-64px)] overflow-hidden">
				<MailComponent />
			</div>
		</AuthGuard>
	);
}
