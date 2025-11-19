import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteDevice } from '../../store/devicesSlice';
import { toast } from 'react-toastify';

const FanDevice = ({ device }) => {
  const dispatch = useDispatch();
  const { settings } = device;

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    // Local state change only - update functionality removed
  };

  const getRotationSpeed = () => {
    if (settings.speed === 0) return 0;
    const minDuration = 0.3; // fastest
    const maxDuration = 3; // slowest
    const duration = maxDuration - ((settings.speed / 100) * (maxDuration - minDuration));
    return duration;
  };

  const rotationSpeed = getRotationSpeed();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-12">
      {/* Fan Visual - Large centered display */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-[300px] h-[300px] relative flex items-center justify-center">
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
      </div>

      {/* Control Panel - Fixed at bottom */}
      <div className="bg-dark-card rounded-2xl p-6 w-full max-w-[480px] shadow-xl">
        <div className="flex flex-col gap-5">
          {/* Speed Slider */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm text-white/70 font-medium flex justify-between items-center">
              <span>Speed</span>
              <span className="text-white font-semibold">{settings.speed}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.speed}
              onChange={handleSpeedChange}
              className="w-full h-1.5 rounded-full bg-dark-border outline-none appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #5eb3f6 0%, #5eb3f6 ${settings.speed}%, #2d3250 ${settings.speed}%, #2d3250 100%)`,
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
          box-sha-owadow: none;
        }
      `}</style>
    </div>
  );
};

export default FanDevice;
