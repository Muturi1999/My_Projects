#!/bin/bash

# Guava Store Deployment Helper Script
# This script provides convenient commands for managing the Docker deployment

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Command handlers
cmd_build() {
    print_header "Building Docker Images"
    docker-compose build
    print_success "Build completed successfully"
}

cmd_start() {
    print_header "Starting Services"
    docker-compose up -d
    print_success "Services started"
    cmd_status
}

cmd_stop() {
    print_header "Stopping Services"
    docker-compose down
    print_success "Services stopped"
}

cmd_restart() {
    print_header "Restarting Services"
    docker-compose restart
    print_success "Services restarted"
}

cmd_status() {
    print_header "Service Status"
    docker-compose ps
}

cmd_logs() {
    local service=$1
    if [ -z "$service" ]; then
        print_header "Showing Logs (All Services)"
        docker-compose logs -f
    else
        print_header "Showing Logs ($service)"
        docker-compose logs -f "$service"
    fi
}

cmd_migrate() {
    print_header "Running Database Migrations"
    docker-compose exec backend python manage.py migrate
    print_success "Migrations completed"
}

cmd_superuser() {
    print_header "Creating Superuser"
    docker-compose exec backend python manage.py createsuperuser
}

cmd_collect_static() {
    print_header "Collecting Static Files"
    docker-compose exec backend python manage.py collectstatic --noinput
    print_success "Static files collected"
}

cmd_backup_db() {
    print_header "Backing Up Database"
    local backup_file="backup_$(date +%Y%m%d_%H%M%S).sql"
    docker-compose exec db pg_dump -U postgres guava > "$backup_file"
    print_success "Database backed up to: $backup_file"
}

cmd_restore_db() {
    local backup_file=$1
    if [ -z "$backup_file" ]; then
        print_error "Usage: deploy.sh restore_db <backup_file>"
        return 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        return 1
    fi
    
    print_header "Restoring Database"
    print_warning "This will overwrite the current database"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose exec -T db psql -U postgres guava < "$backup_file"
        print_success "Database restored"
    else
        print_warning "Restore cancelled"
    fi
}

cmd_shell_backend() {
    print_header "Opening Django Shell"
    docker-compose exec backend python manage.py shell
}

cmd_shell_db() {
    print_header "Opening Database Shell"
    docker-compose exec db psql -U postgres guava
}

cmd_clean() {
    print_header "Cleaning Up Docker Resources"
    print_warning "This will remove stopped containers and dangling images"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker system prune -f
        print_success "Cleanup completed"
    else
        print_warning "Cleanup cancelled"
    fi
}

cmd_health_check() {
    print_header "Health Check"
    
    echo "Checking services..."
    docker-compose ps
    
    echo -e "\n${BLUE}Checking API endpoint...${NC}"
    if curl -f -s http://localhost:8000/api/ > /dev/null; then
        print_success "Backend API is responding"
    else
        print_error "Backend API is not responding"
    fi
    
    echo -e "\n${BLUE}Checking Frontend...${NC}"
    if curl -f -s http://localhost:3000 > /dev/null; then
        print_success "Frontend is responding"
    else
        print_error "Frontend is not responding"
    fi
    
    echo -e "\n${BLUE}Checking Nginx...${NC}"
    if docker-compose exec -T nginx nginx -t > /dev/null 2>&1; then
        print_success "Nginx configuration is valid"
    else
        print_error "Nginx configuration has errors"
    fi
}

cmd_update() {
    print_header "Updating Application"
    print_warning "This will rebuild images and restart services"
    
    echo "Pulling latest changes..."
    git pull
    
    cmd_build
    cmd_stop
    cmd_start
    cmd_migrate
    
    print_success "Update completed successfully"
}

cmd_help() {
    cat << EOF
${BLUE}Guava Store Deployment Helper${NC}

Usage: ./deploy.sh [command] [options]

Commands:
    ${GREEN}build${NC}               Build Docker images
    ${GREEN}start${NC}               Start all services
    ${GREEN}stop${NC}                Stop all services
    ${GREEN}restart${NC}             Restart all services
    ${GREEN}status${NC}              Show service status
    ${GREEN}logs${NC} [service]      View service logs (default: all)
    ${GREEN}migrate${NC}             Run database migrations
    ${GREEN}superuser${NC}           Create Django superuser
    ${GREEN}collect-static${NC}      Collect static files
    ${GREEN}backup${NC}              Backup database
    ${GREEN}restore${NC} <file>      Restore database from backup
    ${GREEN}shell-backend${NC}       Open Django shell
    ${GREEN}shell-db${NC}            Open database shell
    ${GREEN}health${NC}              Run health checks
    ${GREEN}update${NC}              Update and redeploy application
    ${GREEN}clean${NC}               Clean up Docker resources
    ${GREEN}help${NC}                Show this help message

Examples:
    ./deploy.sh start
    ./deploy.sh logs backend
    ./deploy.sh backup
    ./deploy.sh restore backup_20251227_120000.sql
    ./deploy.sh logs nginx
    ./deploy.sh health

EOF
}

# Main script logic
main() {
    local command=${1:-help}
    
    case "$command" in
        build)
            cmd_build
            ;;
        start)
            cmd_start
            ;;
        stop)
            cmd_stop
            ;;
        restart)
            cmd_restart
            ;;
        status)
            cmd_status
            ;;
        logs)
            cmd_logs "$2"
            ;;
        migrate)
            cmd_migrate
            ;;
        superuser)
            cmd_superuser
            ;;
        collect-static)
            cmd_collect_static
            ;;
        backup)
            cmd_backup_db
            ;;
        restore)
            cmd_restore_db "$2"
            ;;
        shell-backend)
            cmd_shell_backend
            ;;
        shell-db)
            cmd_shell_db
            ;;
        health)
            cmd_health_check
            ;;
        update)
            cmd_update
            ;;
        clean)
            cmd_clean
            ;;
        help)
            cmd_help
            ;;
        *)
            print_error "Unknown command: $command"
            cmd_help
            exit 1
            ;;
    esac
}

main "$@"
