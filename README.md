# Device Sandbox Simulator

A full-stack web application that allows users to interact with and control virtual devices (Light and Fan) inside a sandbox environment with drag-and-drop functionality, real-time device controls, and preset management.

## Features

- **Drag & Drop Interface**: Intuitive device placement on canvas
- **Virtual Devices**:
  - **Light Device**: Power control, brightness slider (0-100%), color temperature selection (warm, neutral, cool, pink, blue, purple)
  - **Fan Device**: Power control, speed slider (0-100%), animated fan blades
- **Preset Management**: Save, load, and delete device configurations

## Tech Stack

### Frontend
- React 19 with Hooks
- Redux Toolkit for state management
- React DnD (Drag and Drop)
- Axios for API calls
- Tailwind CSS for styling
- React Icons

### Backend
- Laravel 
- MySQL Database
- RESTful API architecture

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

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- PHP (v8.1 or higher)
- Composer
- MySQL

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd simulator_backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Configure the database in `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=simulator_backend
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

4. Run database migrations:
   ```bash
   php artisan migrate
   ```

5. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd simulator_frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. The `.env` file is already configured with:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## API Endpoints

### Device Endpoints
- `GET /api/devices` - Get all devices
- `POST /api/devices` - Create a new device
- `GET /api/devices/{id}` - Get a specific device
- `PUT /api/devices/{id}` - Update a device
- `DELETE /api/devices/{id}` - Delete a device
- `DELETE /api/devices` - Delete all devices

### Preset Endpoints
- `GET /api/presets` - Get all presets
- `POST /api/presets` - Create a new preset
- `GET /api/presets/{id}` - Get a specific preset
- `PUT /api/presets/{id}` - Update a preset
- `DELETE /api/presets/{id}` - Delete a preset
- `GET /api/presets/{id}/load` - Load preset configuration

## Database Schema

### `devices` Table
- `id` - Primary key
- `type` - Device type (light/fan)
- `name` - Device name
- `settings` - JSON field for device settings
- `position_x` - X position on canvas
- `position_y` - Y position on canvas
- `created_at` - Timestamp
- `updated_at` - Timestamp

### `presets` Table
- `id` - Primary key
- `name` - Preset name
- `description` - Preset description (nullable)
- `devices` - JSON array of device configurations
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Features in Detail


#### Light Device
- **Power Button**: Toggle light on/off
- **Brightness Slider**: Adjust brightness (0-100%)
- **Color Temperature**: Choose from 6 color options
- **Visual Feedback**: Real-time glow effect and color changes

#### Fan Device
- **Power Button**: Toggle fan on/off
- **Speed Slider**: Adjust speed (0-100%)
- **Visual Feedback**: Animated spinning blades with speed-based rotation

### Preset Management
1. **Save Preset**: Enter a name and save current device configuration
2. **Load Preset**: Drag and drop a preset onto the canvas to restore its configuration
3. **Delete Preset**: Remove presets you no longer need

