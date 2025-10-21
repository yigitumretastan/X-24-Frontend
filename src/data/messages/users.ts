export interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  role: string;
  isOnline: boolean;
  lastSeen: Date;
  bio?: string;
  location?: string;
}

export const users: User[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+90 532 123 45 67',
    role: 'Proje Müdürü',
    isOnline: true,
    lastSeen: new Date(),
    bio: 'Yazılım geliştirme ve proje yönetimi konularında 8 yıllık deneyim.',
    location: 'İstanbul, Türkiye'
  },
  {
    id: '2',
    name: 'Ayşe Kaya',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    phone: '+90 533 234 56 78',
    role: 'UI/UX Designer',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 dakika önce
    bio: 'Kullanıcı deneyimi ve arayüz tasarımı uzmanı.',
    location: 'Ankara, Türkiye'
  },
  {
    id: '3',
    name: 'Mehmet Demir',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+90 534 345 67 89',
    role: 'Backend Developer',
    isOnline: true,
    lastSeen: new Date(),
    bio: 'Node.js ve Python ile backend geliştirme.',
    location: 'İzmir, Türkiye'
  },
  {
    id: '4',
    name: 'Fatma Özkan',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    phone: '+90 535 456 78 90',
    role: 'Frontend Developer',
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 saat önce
    bio: 'React ve Vue.js ile modern web uygulamaları geliştiriyorum.',
    location: 'Bursa, Türkiye'
  },
  {
    id: '5',
    name: 'Can Arslan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    phone: '+90 536 567 89 01',
    role: 'DevOps Engineer',
    isOnline: true,
    lastSeen: new Date(),
    bio: 'Cloud infrastructure ve CI/CD pipeline uzmanı.',
    location: 'Antalya, Türkiye'
  },
  {
    id: '6',
    name: 'Zeynep Şahin',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    phone: '+90 537 678 90 12',
    role: 'QA Engineer',
    isOnline: false,
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 gün önce
    bio: 'Yazılım kalitesi ve test otomasyonu konularında uzman.',
    location: 'Konya, Türkiye'
  }
];
