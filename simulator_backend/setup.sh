#!/bin/bash

# Device Sandbox Simulator - Backend Setup Script
# This script automates the setup process for the Laravel backend

echo "=================================="
echo "Device Sandbox Simulator Backend"
echo "Setup Script"
echo "=================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    print_error "PHP is not installed. Please install PHP 8.1 or higher."
    exit 1
fi

print_success "PHP is installed: $(php -v | head -n 1)"

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    print_error "Composer is not installed. Please install Composer."
    exit 1
fi

print_success "Composer is installed"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    print_error "MySQL is not installed. Please install MySQL."
    exit 1
fi

print_success "MySQL is installed"

echo ""
print_info "Starting setup process..."
echo ""

# Install Composer dependencies
print_info "Installing Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

if [ $? -eq 0 ]; then
    print_success "Composer dependencies installed"
else
    print_error "Failed to install Composer dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_info "Creating .env file from .env.example..."
    cp .env.example .env
    print_success ".env file created"
else
    print_info ".env file already exists"
fi

# Generate application key
print_info "Generating application key..."
php artisan key:generate --force
print_success "Application key generated"

# Prompt for database credentials
echo ""
print_info "Database Configuration"
echo ""

read -p "Enter MySQL username (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Enter MySQL password: " DB_PASS
echo ""

read -p "Enter database name (default: simulator_backend): " DB_NAME
DB_NAME=${DB_NAME:-simulator_backend}

# Update .env file with database credentials
print_info "Updating .env file with database credentials..."

# Use sed to update the .env file
sed -i "s/^DB_USERNAME=.*/DB_USERNAME=$DB_USER/" .env
sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=\"$DB_PASS\"/" .env
sed -i "s/^DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env

print_success "Database credentials updated in .env"

# Create database
print_info "Creating database..."
mysql -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    print_success "Database '$DB_NAME' created (or already exists)"
else
    print_error "Failed to create database. Please check your MySQL credentials."
    exit 1
fi

# Clear Laravel cache
print_info "Clearing Laravel cache..."
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear
print_success "Cache cleared"

# Run migrations
print_info "Running database migrations..."
php artisan migrate --force

if [ $? -eq 0 ]; then
    print_success "Database migrations completed"
else
    print_error "Failed to run migrations"
    exit 1
fi

# Create SQL dump
print_info "Creating SQL dump for future setup..."
mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > database/simulator_backend.sql 2>/dev/null

if [ $? -eq 0 ]; then
    print_success "SQL dump created at database/simulator_backend.sql"
else
    print_error "Failed to create SQL dump"
fi

echo ""
echo "=================================="
print_success "Setup completed successfully!"
echo "=================================="
echo ""
print_info "To start the development server, run:"
echo "  php artisan serve"
echo ""
print_info "The API will be available at:"
echo "  http://localhost:8000/api"
echo ""
print_info "Documentation:"
echo "  - Backend README: README_BACKEND.md"
echo "  - API Examples: API_EXAMPLES.md"
echo ""
print_info "Available API Endpoints:"
echo "  - GET    /api/devices           - Get all devices"
echo "  - POST   /api/devices           - Create a device"
echo "  - GET    /api/devices/{id}      - Get a specific device"
echo "  - PUT    /api/devices/{id}      - Update a device"
echo "  - DELETE /api/devices/{id}      - Delete a device"
echo "  - GET    /api/presets           - Get all presets"
echo "  - POST   /api/presets           - Create a preset"
echo "  - GET    /api/presets/{id}      - Get a specific preset"
echo "  - PUT    /api/presets/{id}      - Update a preset"
echo "  - DELETE /api/presets/{id}      - Delete a preset"
echo "  - GET    /api/presets/{id}/load - Load a preset"
echo ""
