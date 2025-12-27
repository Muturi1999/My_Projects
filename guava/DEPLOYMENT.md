# Deployment Guide - Guava Store

## Overview
This guide covers deploying the Guava Store project (Django backend + Next.js frontend) to your server at `https://guavastore.malipopopote.solutions/` with IP `37.60.253.250`.

## Architecture

The application uses Docker with the following services:
- **PostgreSQL Database** (db)
- **Django Backend** (backend) - Runs with Gunicorn
- **Next.js Frontend** (frontend)
- **Nginx** (reverse proxy & SSL/TLS termination)

## Prerequisites

1. **Server Setup**
   - Ubuntu 20.04+ or similar Linux distribution
   - Docker & Docker Compose installed
   - SSH access to the server
   - Domain DNS pointing to your IP (37.60.253.250)
   - Port 80 and 443 open in firewall

2. **SSL Certificates**
   - Obtain SSL certificates (Let's Encrypt recommended)
   - Place them in an `ssl` directory:
     - `ssl/cert.pem` (certificate)
     - `ssl/key.pem` (private key)

## Installation Steps

### 1. Prepare Your Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create app directory
mkdir -p /opt/guava-store
cd /opt/guava-store
```

### 2. Clone/Upload Project

```bash
# If using git
git clone <your-repo-url> .

# Or upload files via SCP
# scp -r . user@37.60.253.250:/opt/guava-store/
```

### 3. Set Up SSL Certificates

**Option A: Using Let's Encrypt (Recommended)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificates
sudo certbot certonly --standalone -d guavastore.malipopopote.solutions

# Copy to project
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/guavastore.malipopopote.solutions/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/guavastore.malipopopote.solutions/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

**Option B: Using Self-Signed Certificates (Testing Only)**

```bash
mkdir -p ssl
openssl req -x509 -newkey rsa:4096 -nodes -out ssl/cert.pem -keyout ssl/key.pem -days 365
```

### 4. Configure Environment Variables

Create `.env.production` in project root:

```bash
cp .env.production .env
# Edit with your values
nano .env
```

Key variables to set:
- `SECRET_KEY` - Generate a strong key: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
- `DB_PASSWORD` - Strong database password
- `EMAIL_*` - Email configuration for notifications
- `CORS_ALLOWED_ORIGINS` - Set to your domain

### 5. Build and Deploy with Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### 6. Initialize Database

```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Collect static files (if needed)
docker-compose exec backend python manage.py collectstatic --noinput
```

## Maintenance

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### Stopping/Restarting
```bash
# Stop all services
docker-compose down

# Restart
docker-compose up -d

# Restart specific service
docker-compose restart backend
```

### Database Backups
```bash
# Backup
docker-compose exec db pg_dump -U postgres guava > backup.sql

# Restore
docker-compose exec -T db psql -U postgres guava < backup.sql
```

### Updating Code

```bash
# Pull latest changes
git pull

# Rebuild images
docker-compose build

# Restart services
docker-compose up -d

# Run migrations if needed
docker-compose exec backend python manage.py migrate
```

### SSL Certificate Renewal (Let's Encrypt)

```bash
# Auto-renew (runs daily)
sudo certbot renew --quiet

# Manual renewal
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/guavastore.malipopopote.solutions/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/guavastore.malipopopote.solutions/privkey.pem ssl/key.pem

# Restart nginx
docker-compose restart nginx
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 80/443
sudo lsof -i :80
sudo lsof -i :443
```

### Database Connection Issues
```bash
# Check database logs
docker-compose logs db

# Check health
docker-compose ps db
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Ensure API_URL is correct in environment
docker-compose exec frontend env | grep API
```

### Backend 502 Bad Gateway
```bash
# Check backend health
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Check nginx proxy settings
docker-compose logs nginx
```

## Security Checklist

- [ ] Change default `SECRET_KEY` in .env
- [ ] Change database password in .env
- [ ] Set `DEBUG=False` in production
- [ ] Update `ALLOWED_HOSTS` to your domain
- [ ] Configure proper `CORS_ALLOWED_ORIGINS`
- [ ] Set up SSL certificates (not self-signed in production)
- [ ] Implement proper email configuration
- [ ] Set strong `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE`
- [ ] Regularly backup database
- [ ] Keep Docker images updated
- [ ] Monitor logs for errors/attacks
- [ ] Implement rate limiting if needed

## File Structure After Deployment

```
/opt/guava-store/
├── backend/
├── frontend/
├── docker-compose.yml
├── nginx.conf
├── .env
├── ssl/
│   ├── cert.pem
│   └── key.pem
└── README.md
```

## Support Resources

- Django Documentation: https://docs.djangoproject.com/
- Next.js Documentation: https://nextjs.org/docs
- Docker Documentation: https://docs.docker.com/
- Nginx Documentation: https://nginx.org/en/docs/

---

**Created**: December 27, 2025
**Domain**: https://guavastore.malipopopote.solutions/
**Server IP**: 37.60.253.250
