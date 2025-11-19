# Device Sandbox Simulator

A full-stack IoT device simulator application that allows users to control virtual devices (lights and fans) and save/load device configurations as presets.

##  Features

- **Drag & Drop Interface**: Intuitive drag-and-drop to add devices to the canvas
- **Device Controls**:
  - **Light Device**: Brightness control (0-100%) and color temperature (Warm, Neutral, Cool, Pink, Blue, Purple)
  - **Fan Device**: Speed control (0-100%) with visual rotation animation
- **Preset Management**:
  - Save current device configurations as named presets
  - Load saved presets to quickly restore device states
  - Delete presets with confirmation dialog
- **Real-time Updates**: All device changes are persisted to the backend database
- **Modern UI**: Dark theme with smooth animations and toast notifications

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Redux Toolkit** - State management with async thunks
- **React DnD** - Drag and drop functionality
- **Tailwind CSS** - Utility-first styling
- **React Toastify** - Toast notifications
- **Axios** - HTTP client

### Backend
- **Laravel 10** - PHP framework
- **MySQL** - Database
- **RESTful API** - API architecture

## Project Structure

```
ollyo/
├── simulator_frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas/         # Drop zone and device rendering
│   │   │   ├── Devices/        # LightDevice and FanDevice components
│   │   │   └── Sidebar/        # Device library and preset manager
│   │   ├── services/
│   │   │   └── deviceService.js # API service layer
│   │   ├── store/
│   │   │   ├── store.js        # Redux store configuration
│   │   │   ├── devicesSlice.js # Device state management
│   │   │   └── presetsSlice.js # Preset state management
│   │   ├── App.js              # Main application component
│   │   └── index.js            # Application entry point
│   ├── package.json
│   └── .env                    # Frontend environment variables
│
└── simulator_backend/           # Laravel backend API
    ├── app/
    │   ├── Http/Controllers/
    │   │   ├── DeviceController.php  # Device CRUD operations
    │   │   └── PresetController.php  # Preset CRUD operations
    │   └── Models/
    │       ├── Device.php       # Device model
    │       └── Preset.php       # Preset model
    ├── routes/
    │   └── api.php             # API route definitions
    ├── database/
    │   └── migrations/         # Database migrations
    └── .env                    # Backend environment variables
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PHP** (v8.1 or higher)
- **Composer**
- **MySQL** (v5.7 or higher)

## 🚀 Installation & Setup

### 1. Database Setup

#### Import the SQL dump

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE simulator_backend;
exit;

# Import the SQL dump
mysql -u root -p simulator_backend < simulator_database.sql
```

### 2. Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd simulator_backend

# Install dependencies
composer install

# Copy environment file (if not exists)
cp .env.example .env

# Configure .env file with your database credentials
# Update these values:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simulator_backend
DB_USERNAME=root
DB_PASSWORD=your_password

# Generate application key
php artisan key:generate

# Start Laravel development server
php artisan serve
# Backend will run at: http://localhost:8000
```

### 3. Frontend Setup (React)

```bash
# Open a new terminal
# Navigate to frontend directory
cd simulator_frontend

# Install dependencies
npm install

# Create .env file (if not exists)
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# Start React development server
npm start
# Frontend will run at: http://localhost:3000
```

## 🔌 API Endpoints

### Devices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/devices` | Get all devices |
| GET | `/api/devices/{id}` | Get single device |
| POST | `/api/devices` | Create a new device |
| PUT | `/api/devices/{id}` | Update device settings |
| DELETE | `/api/devices/{id}` | Delete single device |
| DELETE | `/api/devices` | Delete all devices |

### Presets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/presets` | Get all presets |
| GET | `/api/presets/{id}` | Get single preset |
| POST | `/api/presets` | Create a new preset |
| PUT | `/api/presets/{id}` | Update preset |
| DELETE | `/api/presets/{id}` | Delete preset |

## 🎮 How to Use

### Adding a Device
1. Drag a **Light** or **Fan** device from the sidebar
2. Drop it onto the canvas
3. The device will be created and displayed

### Controlling Devices
- **Light**:
  - Adjust brightness with the slider (0-100%)
  - Click color buttons to change temperature
- **Fan**:
  - Adjust speed with the slider (0-100%)
  - Watch the fan blades rotate based on speed

### Saving Presets
1. Configure your device settings
2. Click **Save Preset** button
3. Enter a preset name
4. Click **Save**

### Loading Presets
1. Drag a saved preset from the sidebar
2. Drop it onto the canvas
3. The device will load with saved settings

### Deleting Presets
1. Click the trash icon on a preset
2. Choose whether to also clear the canvas
3. Confirm deletion

## 📝 Database Schema

### Devices Table
```sql
- id (bigint, primary key)
- type (varchar) - 'light' or 'fan'
- name (varchar)
- settings (json) - device-specific settings
- position_x (integer) - X position on canvas
- position_y (integer) - Y position on canvas
- created_at (timestamp)
- updated_at (timestamp)
```

### Presets Table
```sql
- id (bigint, primary key)
- name (varchar) - preset name
- description (text, nullable)
- devices (json) - array of device configurations
- created_at (timestamp)
- updated_at (timestamp)
```

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
php artisan serve --port=8001
# Update REACT_APP_API_URL to http://localhost:8001/api
```

**Database connection error:**
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

### Frontend Issues

**Port 3000 already in use:**
- The app will prompt to use port 3001
- Or manually set: `PORT=3001 npm start`

**API connection error:**
- Verify backend is running at http://localhost:8000
- Check REACT_APP_API_URL in `.env`
- Check browser console for CORS errors

## 🚦 Current Features

-  Single device display (one device at a time on canvas)
-  Real-time device settings update
-  Preset save/load/delete functionality
-  Toast notifications for all actions
-  Dark theme UI with smooth animations
-  Drag and drop interface


### Backend (Laravel)
- laravel/framework: ^10.0
- PHP: ^8.1

### Frontend (React)
- react: ^19.0.0
- react-redux: ^9.1.2
- @reduxjs/toolkit: ^2.3.0
- react-dnd: ^16.0.1
- react-toastify: ^10.0.6
- axios: ^1.7.9
- tailwindcss: ^3.4.17


