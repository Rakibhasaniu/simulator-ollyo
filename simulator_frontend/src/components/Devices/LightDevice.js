import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteDevice } from '../../store/devicesSlice';
import { toast } from 'react-toastify';

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

  const handleBrightnessChange = (e) => {
    const newBrightness = parseInt(e.target.value);
    // Local state change only - update functionality removed
  };

  const handleColorChange = (colorName) => {
    // Local state change only - update functionality removed
  };

  const getCurrentColor = () => {
    const colorOption = COLOR_OPTIONS.find(c => c.name === settings.colorTemp);
    return colorOption ? colorOption.color : '#FFFFFF';
  };

  const lightOpacity = settings.brightness / 100; // Always on, controlled by brightness
  const currentColor = getCurrentColor();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-12">
      {/* Light Visual - Large centered display */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
          {/* Glow Effect */}
          <div
            className="absolute w-[400px] h-[400px] rounded-full blur-[60px]"
            style={{
              background: `radial-gradient(circle, ${currentColor} 0%, transparent 70%)`,
              opacity: lightOpacity * 0.6,
            }}
          />
          {/* Core Light */}
          <div
            className="relative w-[180px] h-[180px] rounded-full z-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, ${currentColor} 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)`,
              opacity: lightOpacity,
            }}
          />
        </div>
      </div>

      {/* Control Panel - Fixed at bottom */}
      <div className="bg-dark-card rounded-2xl p-6 w-full max-w-[480px] shadow-xl">
        <div className="flex flex-col gap-5">
          {/* Color Temperature */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm text-white/70 font-medium">Color Temperature</label>
            <div className="flex gap-2.5">
              {COLOR_OPTIONS.slice(0, 4).map((colorOption) => (
                <button
                  key={colorOption.name}
                  className={`flex-1 h-12 rounded-xl border-2 cursor-pointer transition-all ${
                    settings.colorTemp === colorOption.name
                      ? 'border-accent-blue scale-105'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption.color }}
                  onClick={() => handleColorChange(colorOption.name)}
                />
              ))}
            </div>
          </div>

          {/* Brightness Slider */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm text-white/70 font-medium flex justify-between items-center">
              <span>Brightness</span>
              <span className="text-white font-semibold">{settings.brightness}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.brightness}
              onChange={handleBrightnessChange}
              className="w-full h-1.5 rounded-full bg-dark-border outline-none appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #5eb3f6 0%, #5eb3f6 ${settings.brightness}%, #2d3250 ${settings.brightness}%, #2d3250 100%)`,
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
