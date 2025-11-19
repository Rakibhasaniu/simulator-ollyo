# Database Setup Instructions

## SQL Dump File
The database dump is located at: **[database_dump.sql](database_dump.sql)**

## Option 1: Import Using Command Line

### Step 1: Create Database
```bash
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE simulator_backend;
exit;
```

### Step 2: Import SQL Dump
```bash
mysql -u root -p simulator_backend < database_dump.sql
```

Enter your MySQL password when prompted.

### Step 3: Verify Import
```bash
mysql -u root -p simulator_backend
```

Then check tables:
```sql
SHOW TABLES;
SELECT * FROM devices;
SELECT * FROM presets;
exit;
```

---

## Option 2: Import Using phpMyAdmin

1. Open phpMyAdmin in your browser
2. Click on "New" to create a database named `simulator_backend`
3. Select the `simulator_backend` database
4. Click on "Import" tab
5. Click "Choose File" and select `database_dump.sql`
6. Click "Go" to import

---

## Option 3: Import Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to **Server** → **Data Import**
4. Select **Import from Self-Contained File**
5. Browse and select `database_dump.sql`
6. Under "Default Target Schema", select or create `simulator_backend`
7. Click **Start Import**

---

## Database Structure

The dump includes the following tables:

### 1. `devices` Table
Stores all virtual devices (lights and fans) with their settings and positions.

**Columns:**
- `id` - Auto-increment primary key
- `type` - VARCHAR(255): Device type ('light' or 'fan')
- `name` - VARCHAR(255): Device name
- `settings` - JSON: Device-specific settings (power, brightness, color, speed)
- `position_x` - INT: X coordinate on canvas
- `position_y` - INT: Y coordinate on canvas
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

**Example Data:**
```json
{
  "id": 1,
  "type": "light",
  "name": "Living Room Light",
  "settings": {
    "power": true,
    "brightness": 75,
    "colorTemp": "warm"
  },
  "position_x": 100,
  "position_y": 150
}
```

### 2. `presets` Table
Stores saved device configurations as presets.

**Columns:**
- `id` - Auto-increment primary key
- `name` - VARCHAR(255): Preset name
- `description` - TEXT (nullable): Preset description
- `devices` - JSON: Array of device configurations
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

**Example Data:**
```json
{
  "id": 1,
  "name": "Evening Mode",
  "description": "Comfortable evening settings",
  "devices": [
    {
      "type": "light",
      "name": "Living Room Light",
      "settings": {
        "power": true,
        "brightness": 40,
        "colorTemp": "warm"
      }
    },
    {
      "type": "fan",
      "name": "Ceiling Fan",
      "settings": {
        "power": true,
        "speed": 30
      }
    }
  ]
}
```

### 3. Other Tables
- `users` - Default Laravel user authentication table
- `password_reset_tokens` - Password reset functionality
- `failed_jobs` - Laravel queue jobs
- `personal_access_tokens` - Laravel Sanctum tokens
- `migrations` - Laravel migration tracking

---

## Sample Data

The database dump may include sample data:
- 1 test light device with preset settings
- 1 test preset configuration ("Evening Mode")

You can delete this sample data or keep it for testing purposes.

---

## Updating Backend Configuration

After importing the database, make sure your Laravel `.env` file has the correct database credentials:

**File:** `simulator_backend/.env`
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simulator_backend
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

---

## Testing Database Connection

From the backend directory, run:
```bash
cd simulator_backend
php artisan migrate:status
```

You should see all migrations marked as "Ran".

Test the database connection:
```bash
php artisan tinker
```

Then in Tinker:
```php
DB::connection()->getPdo();
\App\Models\Device::count();
\App\Models\Preset::count();
exit;
```

---

## Fresh Database (Alternative)

If you prefer to start with an empty database instead of importing the dump:

1. Create the database:
```sql
CREATE DATABASE simulator_backend;
```

2. Run Laravel migrations:
```bash
cd simulator_backend
php artisan migrate
```

This will create all tables with the correct structure but no sample data.

---

### Check MySQL Version
The dump was created with MySQL 8.x. If you're using an older version, you might need to adjust:
```bash
mysql --version
```

---

## After Import Checklist

- [ ] Database `simulator_backend` created
- [ ] All tables imported (check with `SHOW TABLES;`)
- [ ] Backend `.env` configured with correct credentials
- [ ] Laravel can connect to database (`php artisan migrate:status`)
- [ ] API endpoints work (`curl http://localhost:8000/api/devices`)
- [ ] Frontend can fetch data from backend

---

## Quick Import Command (All-in-One)

```bash
# Navigate to project root
cd /home/rakib/Documents/ollyo

# Create database and import dump
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS simulator_backend;"
mysql -u root -p simulator_backend < database_dump.sql

# Verify import
mysql -u root -p simulator_backend -e "SHOW TABLES;"
```


