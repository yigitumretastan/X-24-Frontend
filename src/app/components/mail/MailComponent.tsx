"use client";

import * as React from "react";
import { 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Archive, 
  Search, 
  Plus, 
  MoreVertical,
  Reply,
  Forward,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/app/contexts/ThemeContext";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Mail {
  id: string;
  name: string;
  email: string;
  subject: string;
  text: string;
  date: string;
  read: boolean;
  labels: string[];
}

const mails: Mail[] = [
  {
    id: "1",
    name: "William Smith",
    email: "wsmith@example.com",
    subject: "Proje Toplantısı Hakkında",
    text: "Merhaba, yarın saat 10:00'da yapılacak proje toplantısı için sunum hazır mı? Eğer hazırsa üzerinden geçmek isterim. POP3 entegrasyonu konusundaki ilerlemeleriniz harika görünüyor.",
    date: "12:45",
    read: false,
    labels: ["iş", "öncelikli"],
  },
  {
    id: "2",
    name: "Alice Johnson",
    email: "alice@example.com",
    subject: "Haftalık Rapor",
    text: "Geçen haftanın performans verilerini içeren rapor ekte yer almaktadır. Lütfen inceleyip geri bildirimlerinizi iletin. Yeni tasarım arayüzü çok daha modern olmuş.",
    date: "Dün",
    read: true,
    labels: ["rapor"],
  },
  {
    id: "3",
    name: "GitHub",
    email: "noreply@github.com",
    subject: "[GitHub] Güvenlik Bildirimi",
    text: "Hesabınıza yeni bir cihazdan giriş yapıldı. Eğer bu işlemi siz yapmadıysanız lütfen şifrenizi sıfırlayın.",
    date: "20 Nis",
    read: true,
    labels: ["güvenlik"],
  }
];

export default function MailComponent() {
  useTheme();
  const [selectedMailId, setSelectedMailId] = React.useState<string | null>(mails[0].id);
  const [mounted, setMounted] = React.useState(false);
  const [activeFolder, setActiveFolder] = React.useState("inbox");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-screen w-full bg-background" />;
  }

  const selectedMail = mails.find((m) => m.id === selectedMailId) || null;

  return (
    <div className="flex h-[calc(100vh-120px)] w-full flex-col bg-background rounded-2xl border shadow-sm overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
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
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Yeni Posta
            </Button>
          </div>
          <div className="px-2 space-y-1">
            <NavButton 
              icon={<Inbox className="h-4 w-4" />} 
              label="Gelen Kutusu" 
              count={1} 
              isActive={activeFolder === "inbox"}
              onClick={() => setActiveFolder("inbox")}
            />
            <NavButton 
              icon={<FileText className="h-4 w-4" />} 
              label="Taslaklar" 
              isActive={activeFolder === "drafts"}
              onClick={() => setActiveFolder("drafts")}
            />
            <NavButton 
              icon={<Send className="h-4 w-4" />} 
              label="Gönderilenler" 
              isActive={activeFolder === "sent"}
              onClick={() => setActiveFolder("sent")}
            />
            <NavButton 
              icon={<Archive className="h-4 w-4" />} 
              label="Arşiv" 
              isActive={activeFolder === "archive"}
              onClick={() => setActiveFolder("archive")}
            />
            <NavButton 
              icon={<Trash2 className="h-4 w-4" />} 
              label="Çöp Kutusu" 
              isActive={activeFolder === "trash"}
              onClick={() => setActiveFolder("trash")}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={35} minSize={30}>
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <div className="flex items-center px-4 py-2">
              <h2 className="text-lg font-semibold capitalize">{activeFolder}</h2>
              <TabsList className="ml-auto">
                <TabsTrigger value="all">Tümü</TabsTrigger>
                <TabsTrigger value="unread">Okunmamış</TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Ara..." className="pl-8 bg-muted/20" />
              </div>
            </div>
            <TabsContent value="all" className="flex-1 overflow-y-auto m-0">
              <div className="flex flex-col gap-1 p-2">
                {mails.map((mail) => (
                  <button
                    key={mail.id}
                    onClick={() => setSelectedMailId(mail.id)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-xl p-4 text-left text-sm transition-all hover:bg-muted/50",
                      selectedMailId === mail.id && "bg-muted shadow-sm"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{mail.name}</span>
                        {!mail.read && (
                          <span className="flex h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{mail.date}</span>
                    </div>
                    <div className="text-xs font-semibold">{mail.subject}</div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {mail.text}
                    </div>
                    {mail.labels.length > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        {mail.labels.map((label) => (
                          <span 
                            key={label}
                            className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={47}>
          {selectedMail ? (
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
                      {selectedMail.name[0]}
                    </div>
                    <div className="grid gap-1">
                      <div className="font-bold text-base">{selectedMail.name}</div>
                      <div className="text-sm">{selectedMail.subject}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Yanıtla:</span> {selectedMail.email}
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    {selectedMail.date}
                  </div>
                </div>
                <Separator />
                <div className="flex-1 whitespace-pre-wrap p-6 text-sm leading-relaxed">
                  {selectedMail.text}
                </div>
                <Separator className="mt-auto" />
                <div className="p-6">
                  <form>
                    <div className="grid gap-4">
                      <textarea
                        className="flex min-h-[120px] w-full rounded-xl border border-input bg-muted/20 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all placeholder:text-muted-foreground"
                        placeholder={`${selectedMail.name} kişisine yanıt ver...`}
                      />
                      <div className="flex items-center">
                        <Button
                          onClick={(e) => e.preventDefault()}
                          size="sm"
                          className="ml-auto rounded-lg px-6"
                        >
                          Gönder
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
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
    </div>
  );
}

function NavButton({ 
  icon, 
  label, 
  count, 
  isActive, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  count?: number; 
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
        isActive 
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {count && (
        <span className={cn(
          "ml-auto text-xs font-bold px-2 py-0.5 rounded-full",
          isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}
