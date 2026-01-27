# 🚀 Zeniva Frontend Deployment Rehberi

Bu dokümantasyon, Zeniva Frontend uygulamasının farklı ortamlara nasıl deploy edileceğini açıklar.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Ortam Konfigürasyonları](#ortam-konfigürasyonları)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring ve Logging](#monitoring-ve-logging)

## 🎯 Genel Bakış

Zeniva Frontend, Next.js 15 App Router kullanarak geliştirilmiş bir React uygulamasıdır. Statik site generation (SSG) ve server-side rendering (SSR) özelliklerini destekler.

### Deployment Gereksinimleri
- Node.js 18.0+
- Bun runtime (önerilen) veya npm
- Environment variables konfigürasyonu
- Backend API erişimi (ASP.NET Core)

## ⚙️ Ortam Konfigürasyonları

### Development Environment
```env
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=https://localhost:7171
NEXT_PUBLIC_API_URL=https://localhost:7171/api
NEXT_PUBLIC_SIGNALR_HUB_URL=https://localhost:7171/hubs
NEXT_PUBLIC_APP_NAME=Zeniva Dev
ANALYZE=false
```

### Staging Environment
```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://localhost:7171
NEXT_PUBLIC_API_URL=https://localhost:7171/api
NEXT_PUBLIC_SIGNALR_HUB_URL=https://localhost:7171/hubs
NEXT_PUBLIC_APP_NAME=Zeniva Staging
NEXT_PUBLIC_APP_VERSION=1.0.0-staging
```

### Production Environment
```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.zeniva.com
NEXT_PUBLIC_API_URL=https://api.zeniva.com/api
NEXT_PUBLIC_SIGNALR_HUB_URL=https://api.zeniva.com/hubs
NEXT_PUBLIC_APP_NAME=Zeniva
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🔷 Vercel Deployment

Vercel, Next.js uygulamaları için en optimize edilmiş platform sunar.

### 1. Vercel CLI ile Deployment

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Proje dizininde
vercel

# Production deployment
vercel --prod
```

### 2. GitHub Integration

1. **Vercel Dashboard**'a gidin
2. **New Project** > **Import Git Repository**
3. GitHub repository'nizi seçin
4. **Environment Variables** ekleyin
5. **Deploy** butonuna tıklayın

### 3. Vercel Konfigürasyonu

`vercel.json` dosyası oluşturun:

```json
{
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_API_BASE_URL": "@api-base-url",
    "NEXT_PUBLIC_API_URL": "@api-url"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 🟢 Netlify Deployment

### 1. Netlify CLI ile Deployment

```bash
# Netlify CLI kurulumu
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

### 2. Build Konfigürasyonu

`netlify.toml` dosyası oluşturun:

```toml
[build]
  command = "bun run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--version"

[[redirects]]
  from = "/api/*"
  to = "https://api.zeniva.com/api/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build
FROM oven/bun:1 AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  zeniva-frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_BASE_URL=https://api.zeniva.com
      - NEXT_PUBLIC_API_URL=https://api.zeniva.com/api
    restart: unless-stopped
    networks:
      - zeniva-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - zeniva-frontend
    networks:
      - zeniva-network

networks:
  zeniva-network:
    driver: bridge
```

### Build ve Run

```bash
# Build
docker build -t zeniva-frontend .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.zeniva.com \
  zeniva-frontend

# Docker Compose ile
docker-compose up -d
```

## ☁️ AWS Deployment

### AWS Amplify

1. **AWS Console**'da Amplify servisine gidin
2. **New App** > **Host web app**
3. GitHub repository'nizi bağlayın
4. Build settings'i yapılandırın:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g bun
        - bun install
    build:
      commands:
        - bun run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### AWS EC2 + PM2

```bash
# EC2 instance'da
sudo apt update
sudo apt install nodejs npm nginx

# Bun kurulumu
curl -fsSL https://bun.sh/install | bash

# Proje klonlama
git clone <repository-url>
cd Zeniva-Frontend

# Dependencies
bun install

# Build
bun run build

# PM2 ile çalıştırma
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

`ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'zeniva-frontend',
    script: 'bun',
    args: 'start',
    cwd: '/path/to/Zeniva-Frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_API_BASE_URL: 'https://api.zeniva.com'
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

## 🔄 CI/CD Pipeline

### GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
          
      - name: Install dependencies
        run: bun install
        
      - name: Run linter
        run: bun run lint
        
      - name: Type check
        run: bun run type-check
        
      - name: Build
        run: bun run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI/CD

`.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/
    - .next/cache/

test:
  stage: test
  image: oven/bun:1
  script:
    - bun install
    - bun run lint
    - bun run type-check
    - bun run build

deploy_production:
  stage: deploy
  image: oven/bun:1
  script:
    - bun install
    - bun run build
    - # Deploy commands
  only:
    - main
  environment:
    name: production
    url: https://zeniva.com
```

## 📊 Monitoring ve Logging

### Performance Monitoring

```typescript
// lib/analytics.ts
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined') {
    // Google Analytics
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: url,
    });
    
    // Custom analytics
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ page: url, timestamp: Date.now() })
    });
  }
};
```

### Error Tracking

```typescript
// lib/error-tracking.ts
export const captureException = (error: Error, context?: any) => {
  console.error('Application Error:', error, context);
  
  // Sentry integration
  if (typeof window !== 'undefined') {
    Sentry.captureException(error, { extra: context });
  }
};
```

### Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Backend API health check
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`);
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION,
      api: apiResponse.ok ? 'healthy' : 'unhealthy'
    });
  } catch (error) {
    return Response.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    );
  }
}
```

## 🔧 Troubleshooting

### Yaygın Sorunlar

1. **Build Hatası**
   ```bash
   # Cache temizleme
   bun run clean
   rm -rf .next node_modules
   bun install
   bun run build
   ```

2. **Environment Variables**
   ```bash
   # Değişkenleri kontrol et
   printenv | grep NEXT_PUBLIC
   ```

3. **Memory Issues**
   ```bash
   # Node.js memory limit artırma
   NODE_OPTIONS="--max-old-space-size=4096" bun run build
   ```

4. **API Connection**
   ```bash
   # Backend erişimini test et
   curl -I https://api.zeniva.com/health
   ```

## 📋 Deployment Checklist

- [ ] Environment variables ayarlandı
- [ ] Build başarılı
- [ ] Linting geçiyor
- [ ] Type checking geçiyor
- [ ] Backend API erişilebilir
- [ ] SSL sertifikası aktif
- [ ] Domain konfigürasyonu tamamlandı
- [ ] Monitoring kuruldu
- [ ] Backup stratejisi belirlendi
- [ ] Rollback planı hazırlandı

---

**Başarılı deployment'lar! 🚀**
