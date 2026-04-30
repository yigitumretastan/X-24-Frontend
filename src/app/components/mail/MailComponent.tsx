"use client";

import DOMPurify from "dompurify";
import {
	Archive,
	Clock,
	Forward,
	Inbox,
	MoreVertical,
	Plus,
	Reply,
	Trash2,
} from "lucide-react";
import * as React from "react";
import {
	usePostApiMailsList,
	usePostApiMailsSend,
} from "@/api/generated/mails/mails";
import type { MailMessageDto } from "@/api/model/mailMessageDto";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function MailComponent() {
	useTheme();
	const [selectedMailId, setSelectedMailId] = React.useState<string | null>(
		null,
	);
	const [mounted, setMounted] = React.useState(false);
	const [activeFolder, setActiveFolder] = React.useState("inbox");
	const [_selectedCategory, _setSelectedCategory] = React.useState("inbox");
	const [_selectedMail, _setSelectedMail] =
		React.useState<MailMessageDto | null>(null);
	const [isComposeOpen, setIsComposeOpen] = React.useState(false);
	const [isMaximized, setIsMaximized] = React.useState(false);

	// Mail connection settings (normally these would come from user settings)
	const mailSettings = React.useMemo(
		() => ({
			host: "imap.gmail.com",
			port: 993,
			user: "test@gmail.com",
			password: "password",
			useSsl: true,
		}),
		[],
	);

	const {
		mutate: listMails,
		data: listData,
		isPending: isLoading,
	} = usePostApiMailsList();
	const { mutateAsync: sendMail, isPending: isSending } = usePostApiMailsSend();

	const mails = (listData as { data?: MailMessageDto[] })?.data || [];

	const handleFetchMails = React.useCallback(() => {
		listMails({
			data: {
				...mailSettings,
				count: 20,
			},
		});
	}, [listMails, mailSettings]);

	const handleSendMail = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		try {
			await sendMail({
				data: {
					...mailSettings,
					host: "smtp.gmail.com", // SMTP override
					port: 465,
					to: formData.get("to") as string,
					subject: formData.get("subject") as string,
					body: formData.get("body") as string,
				},
			});
			alert("Mail başarıyla gönderildi!");
			setIsComposeOpen(false);
			handleFetchMails(); // Refresh list
		} catch (_error) {
			alert("Mail gönderilirken bir hata oluştu.");
		}
	};

	React.useEffect(() => {
		setMounted(true);
		handleFetchMails();
	}, [handleFetchMails]);

	if (!mounted) {
		return <div className="h-screen w-full bg-background" />;
	}

	const selectedMailData =
		mails.find((m: MailMessageDto) => m.id === selectedMailId) || null;

	return (
		<div className="flex h-[calc(100vh-120px)] w-full flex-col bg-background rounded-2xl border shadow-sm overflow-hidden">
			<ResizablePanelGroup
				direction="horizontal"
				className="h-full items-stretch"
			>
				<ResizablePanel
					defaultSize={18}
					minSize={15}
					maxSize={25}
					className="bg-muted/10"
				>
					<div className="flex h-[52px] items-center px-4">
						<h1 className="text-xl font-bold">E-Posta</h1>
					</div>
					<Separator />
					<div className="p-4">
						<Button
							className="w-full gap-2 bg-primary hover:bg-primary/90"
							onClick={() => setIsComposeOpen(true)}
						>
							<Plus className="h-4 w-4" />
							Yeni Posta
						</Button>
					</div>
					<div className="px-2 space-y-1">
						<NavButton
							icon={<Inbox className="h-4 w-4" />}
							label="Gelen Kutusu"
							count={mails.filter((m: MailMessageDto) => m.id).length}
							isActive={activeFolder === "inbox"}
							onClick={() => setActiveFolder("inbox")}
						/>
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={35} minSize={30}>
					<Tabs defaultValue="all" className="h-full flex flex-col">
						<div className="flex items-center px-4 py-2">
							<h2 className="text-lg font-semibold capitalize">
								{activeFolder}
							</h2>
							<TabsList className="ml-auto">
								<TabsTrigger value="all">Tümü</TabsTrigger>
								<TabsTrigger value="unread">Okunmamış</TabsTrigger>
							</TabsList>
						</div>
						<Separator />
						<div className="p-4 text-xs text-muted-foreground flex justify-between items-center">
							<span>
								{isLoading ? "Yükleniyor..." : `${mails.length} e-posta`}
							</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleFetchMails}
								className="h-7 text-[10px]"
							>
								Yenile
							</Button>
						</div>
						<TabsContent value="all" className="flex-1 overflow-y-auto m-0">
							<div className="flex flex-col gap-1 p-2">
								{mails.map((mail: MailMessageDto) => (
									<button
										type="button"
										key={mail.id}
										onClick={() => setSelectedMailId(mail.id || null)}
										className={cn(
											"flex flex-col items-start gap-2 rounded-xl p-4 text-left text-sm transition-all hover:bg-muted/50",
											selectedMailId === mail.id && "bg-muted shadow-sm",
										)}
									>
										<div className="flex w-full items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="font-bold">{mail.from}</span>
												{/* {!mail.isRead && (
													<span className="flex h-2 w-2 rounded-full bg-primary" />
												)} */}
											</div>
											<span className="text-xs text-muted-foreground">
												{mail.date
													? new Date(mail.date).toLocaleDateString()
													: ""}
											</span>
										</div>
										<div className="text-xs font-semibold">{mail.subject}</div>
										<div className="line-clamp-2 text-xs text-muted-foreground">
											{mail.body}
										</div>
									</button>
								))}
							</div>
						</TabsContent>
					</Tabs>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={47}>
					{selectedMailData ? (
						<div className="flex h-full flex-col">
							<div className="flex items-center p-2">
								<div className="flex items-center gap-2 px-2">
									<Button variant="ghost" size="icon">
										<Archive className="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="icon">
										<Trash2 className="h-4 w-4" />
									</Button>
									<Separator orientation="vertical" className="mx-1 h-6" />
									<Button variant="ghost" size="icon">
										<Clock className="h-4 w-4" />
									</Button>
								</div>
								<div className="ml-auto flex items-center gap-2 px-2">
									<Button variant="ghost" size="icon">
										<Reply className="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="icon">
										<Forward className="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="icon">
										<MoreVertical className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<Separator />
							<div className="flex flex-1 flex-col overflow-y-auto">
								<div className="flex items-start p-6">
									<div className="flex items-start gap-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
											{selectedMailData.from?.[0] || "?"}
										</div>
										<div className="grid gap-1">
											<div className="font-bold text-base">
												{selectedMailData.from}
											</div>
											<div className="text-sm">{selectedMailData.subject}</div>
											<div className="text-xs text-muted-foreground">
												<span className="font-medium">Tarih:</span>{" "}
												{selectedMailData.date
													? new Date(selectedMailData.date).toLocaleString()
													: ""}
											</div>
										</div>
									</div>
								</div>
								<Separator />
								<div
									className="flex-1 p-6 text-sm leading-relaxed overflow-x-auto"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(selectedMailData.body || ""),
									}}
								/>
							</div>
						</div>
					) : (
						<div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
							<div className="flex flex-col items-center gap-4">
								<div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
									<Inbox className="h-8 w-8 opacity-20" />
								</div>
								<p>Görüntülenecek bir e-posta seçilmedi.</p>
							</div>
						</div>
					)}
				</ResizablePanel>
			</ResizablePanelGroup>

			{/* Compose Modal */}
			{isComposeOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div
						className={cn(
							"bg-background rounded-2xl shadow-2xl border w-full max-w-2xl overflow-hidden",
							isMaximized && "max-w-full h-full",
						)}
					>
						<div className="flex items-center justify-between p-4 bg-muted/30">
							<h3 className="font-bold">Yeni İleti</h3>
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsMaximized(!isMaximized)}
								>
									{isMaximized ? "Küçült" : "Büyüt"}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsComposeOpen(false)}
								>
									Kapat
								</Button>
							</div>
						</div>
						<form onSubmit={handleSendMail} className="p-6 space-y-4">
							<Input name="to" placeholder="Alıcı" required />
							<Input name="subject" placeholder="Konu" required />
							<textarea
								name="body"
								placeholder="Mesajınız..."
								className="w-full min-h-[300px] rounded-xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
								required
							/>
							<div className="flex justify-end pt-2">
								<Button type="submit" disabled={isSending}>
									{isSending ? "Gönderiliyor..." : "Gönder"}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

function NavButton({
	icon,
	label,
	count,
	isActive,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	count?: number;
	isActive?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
				isActive
					? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
					: "text-muted-foreground hover:bg-muted hover:text-foreground",
			)}
		>
			{icon}
			<span className="flex-1 text-left">{label}</span>
			{count && (
				<span
					className={cn(
						"ml-auto text-xs font-bold px-2 py-0.5 rounded-full",
						isActive
							? "bg-primary-foreground/20 text-primary-foreground"
							: "bg-primary/10 text-primary",
					)}
				>
					{count}
				</span>
			)}
		</button>
	);
}
