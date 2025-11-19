import React from 'react';
import { useDispatch } from 'react-redux';
import { updateDeviceSettings, updateDeviceAsync, deleteDevice } from '../../store/devicesSlice';
import { FaPowerOff, FaTrash } from 'react-icons/fa';

const FanDevice = ({ device }) => {
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
          name: device.name || 'Fan Device',
          settings: { ...settings, power: !settings.power },
          position_x: device.position?.x,
          position_y: device.position?.y,
        },
      })).unwrap();
    } catch (error) {
      console.error('Failed to update device:', error);
    }
  };

  const handleSpeedChange = async (e) => {
    const newSpeed = parseInt(e.target.value);

    dispatch(updateDeviceSettings({
      deviceId: device.id,
      settings: { speed: newSpeed },
    }));

    try {
      await dispatch(updateDeviceAsync({
        id: device.id,
        deviceData: {
          type: device.type,
          name: device.name || 'Fan Device',
          settings: { ...settings, speed: newSpeed },
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

  const getRotationSpeed = () => {
    if (!settings.power || settings.speed === 0) return 0;
    const minDuration = 0.3; // fastest
    const maxDuration = 3; // slowest
    const duration = maxDuration - ((settings.speed / 100) * (maxDuration - minDuration));
    return duration;
  };

  const rotationSpeed = getRotationSpeed();

  return (
    <div className="bg-dark-card rounded-xl p-5 text-white w-full max-w-[350px] shadow-xl">
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/10">
        <h3 className="text-base font-semibold m-0">Fan Control Panel</h3>
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
        {/* Fan Visual */}
        <div className="flex flex-col justify-center items-center py-8 gap-5 relative">
          {/* Fan Blades */}
          <div className="w-[120px] h-[120px] relative">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <g
                className="origin-center"
                style={{
                  animation: rotationSpeed > 0 ? `spin ${rotationSpeed}s linear infinite` : 'none',
                  transformOrigin: 'center',
                }}
              >
                {/* Center circle */}
                <circle cx="100" cy="100" r="15" fill="#4a4e69" />

                {/* Fan blades */}
                <ellipse cx="100" cy="50" rx="20" ry="45" fill="#5eb3f6" opacity="0.8" />
                <ellipse cx="100" cy="50" rx="20" ry="45" fill="#5eb3f6" opacity="0.8"
                  transform="rotate(120 100 100)" />
                <ellipse cx="100" cy="50" rx="20" ry="45" fill="#5eb3f6" opacity="0.8"
                  transform="rotate(240 100 100)" />

                <circle cx="100" cy="100" r="8" fill="#2d3250" />
              </g>
            </svg>
          </div>

          {/* Breeze Effect */}
          {settings.power && settings.speed > 0 && (
            <div className="flex gap-2 items-center">
              <div className="w-[30px] h-[2px] bg-accent-blue/50 rounded-full animate-[breeze_1.5s_ease-in-out_infinite]" />
              <div className="w-[30px] h-[2px] bg-accent-blue/50 rounded-full animate-[breeze_1.5s_ease-in-out_infinite_0.2s]" />
              <div className="w-[30px] h-[2px] bg-accent-blue/50 rounded-full animate-[breeze_1.5s_ease-in-out_infinite_0.4s]" />
            </div>
          )}
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

          {/* Speed Slider */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] text-white/70 font-medium flex justify-between items-center">
              <span>Speed:</span>
              <span className="text-accent-blue font-semibold">{settings.speed}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.speed}
              onChange={handleSpeedChange}
              className={`w-full h-1.5 rounded-full bg-dark-border outline-none appearance-none cursor-pointer ${
                !settings.power ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!settings.power}
              style={{
                background: settings.power
                  ? `linear-gradient(to right, #5eb3f6 0%, #5eb3f6 ${settings.speed}%, #2d3250 ${settings.speed}%, #2d3250 100%)`
                  : '#2d3250',
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes breeze {
          0%, 100% {
            opacity: 0.3;
            transform: translateX(0);
          }
          50% {
            opacity: 1;
            transform: translateX(10px);
          }
        }

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

export default FanDevice;
