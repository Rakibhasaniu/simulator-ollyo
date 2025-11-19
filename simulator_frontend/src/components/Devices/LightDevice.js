import React from 'react';
import { useDispatch } from 'react-redux';
import { updateDeviceSettings, updateDeviceAsync, deleteDevice } from '../../store/devicesSlice';
import { FaPowerOff, FaTrash } from 'react-icons/fa';

const COLOR_OPTIONS = [
  { name: 'warm', color: '#FFD700', label: 'Warm' },
  { name: 'neutral', color: '#FFFFFF', label: 'Neutral' },
  { name: 'cool', color: '#B0E0E6', label: 'Cool' },
  { name: 'pink', color: '#FFB6C1', label: 'Pink' },
  { name: 'blue', color: '#87CEEB', label: 'Blue' },
  { name: 'purple', color: '#DDA0DD', label: 'Purple' },
];

const LightDevice = ({ device }) => {
  const dispatch = useDispatch();
  const { settings } = device;

  const handlePowerToggle = async () => {
    dispatch(updateDeviceSettings({
      deviceId: device.id,
      settings: { power: !settings.power },
    }));

    try {
      await dispatch(updateDeviceAsync({
        id: device.id,
        deviceData: {
          type: device.type,
          name: device.name || 'Light Device',
          settings: { ...settings, power: !settings.power },
          position_x: device.position?.x,
          position_y: device.position?.y,
        },
      })).unwrap();
    } catch (error) {
      console.error('Failed to update device:', error);
    }
  };

  const handleBrightnessChange = async (e) => {
    const newBrightness = parseInt(e.target.value);

    dispatch(updateDeviceSettings({
      deviceId: device.id,
      settings: { brightness: newBrightness },
    }));

    try {
      await dispatch(updateDeviceAsync({
        id: device.id,
        deviceData: {
          type: device.type,
          name: device.name || 'Light Device',
          settings: { ...settings, brightness: newBrightness },
          position_x: device.position?.x,
          position_y: device.position?.y,
        },
      })).unwrap();
    } catch (error) {
      console.error('Failed to update device:', error);
    }
  };

  const handleColorChange = async (colorName) => {
    dispatch(updateDeviceSettings({
      deviceId: device.id,
      settings: { colorTemp: colorName },
    }));

    try {
      await dispatch(updateDeviceAsync({
        id: device.id,
        deviceData: {
          type: device.type,
          name: device.name || 'Light Device',
          settings: { ...settings, colorTemp: colorName },
          position_x: device.position?.x,
          position_y: device.position?.y,
        },
      })).unwrap();
    } catch (error) {
      console.error('Failed to update device:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await dispatch(deleteDevice(device.id)).unwrap();
    } catch (error) {
      console.error('Failed to delete device:', error);
      alert('Failed to delete device. Please try again.');
    }
  };

  const getCurrentColor = () => {
    const colorOption = COLOR_OPTIONS.find(c => c.name === settings.colorTemp);
    return colorOption ? colorOption.color : '#FFFFFF';
  };

  const lightOpacity = settings.power ? settings.brightness / 100 : 0;
  const currentColor = getCurrentColor();

  return (
    <div className="bg-dark-card rounded-xl p-5 text-white w-full max-w-[350px] shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/10">
        <h3 className="text-base font-semibold m-0">Light Control Panel</h3>
        <button
          className="bg-transparent border-none text-accent-red cursor-pointer p-2 rounded-md transition-all hover:bg-red-500/10 hover:scale-110"
          onClick={handleRemove}
          title="Remove device"
        >
          <FaTrash />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5">
        {/* Light Visual */}
        <div className="flex justify-center items-center py-8 relative">
          <div className="relative w-[100px] h-[100px] flex items-center justify-center">
            {/* Glow Effect */}
            {settings.power && (
              <div
                className="absolute w-[140px] h-[140px] rounded-full blur-[20px] animate-pulse-glow"
                style={{
                  background: `radial-gradient(circle, ${currentColor} 0%, transparent 70%)`,
                  opacity: lightOpacity * 0.6,
                }}
              />
            )}
            {/* Core Light */}
            <div
              className="relative w-[60px] h-[60px] rounded-full z-10 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle, ${currentColor} 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)`,
                opacity: lightOpacity,
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-5">
          {/* Power Button */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] text-white/70 font-medium">Power</label>
            <button
              className={`flex items-center justify-center gap-2.5 px-5 py-3 border-2 rounded-lg cursor-pointer text-sm font-semibold transition-all ${
                settings.power
                  ? 'bg-accent-blue border-accent-blue shadow-[0_0_20px_rgba(94,179,246,0.4)]'
                  : 'bg-transparent border-dark-border text-white hover:bg-accent-blue/10 hover:border-accent-blue'
              }`}
              onClick={handlePowerToggle}
            >
              <FaPowerOff className="text-base" />
              <span>{settings.power ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Color Temperature */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] text-white/70 font-medium">Color Temperature</label>
            <div className="flex gap-2.5 flex-wrap">
              {COLOR_OPTIONS.map((colorOption) => (
                <button
                  key={colorOption.name}
                  className={`w-10 h-10 rounded-lg border-2 cursor-pointer transition-all relative flex items-center justify-center ${
                    settings.colorTemp === colorOption.name
                      ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]'
                      : 'border-transparent hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  } ${!settings.power ? 'opacity-30 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: colorOption.color }}
                  onClick={() => handleColorChange(colorOption.name)}
                  title={colorOption.label}
                  disabled={!settings.power}
                >
                  {settings.colorTemp === colorOption.name && (
                    <span className="text-black font-bold text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Brightness Slider */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] text-white/70 font-medium flex justify-between items-center">
              <span>Brightness:</span>
              <span className="text-accent-blue font-semibold">{settings.brightness}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.brightness}
              onChange={handleBrightnessChange}
              className={`w-full h-1.5 rounded-full bg-dark-border outline-none appearance-none cursor-pointer ${
                !settings.power ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!settings.power}
              style={{
                background: settings.power
                  ? `linear-gradient(to right, #5eb3f6 0%, #5eb3f6 ${settings.brightness}%, #2d3250 ${settings.brightness}%, #2d3250 100%)`
                  : '#2d3250',
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #5eb3f6;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(94, 179, 246, 0.5);
          transition: all 0.3s ease;
        }

        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(94, 179, 246, 0.8);
        }

        input[type='range']::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #5eb3f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(94, 179, 246, 0.5);
          transition: all 0.3s ease;
        }

        input[type='range']::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(94, 179, 246, 0.8);
        }

        input[type='range']:disabled::-webkit-slider-thumb {
          cursor: not-allowed;
          background: #4a4e69;
          box-shadow: none;
        }

        input[type='range']:disabled::-moz-range-thumb {
          cursor: not-allowed;
          background: #4a4e69;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
};

export default LightDevice;
