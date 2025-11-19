import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { createDevice, deleteAllDevices } from '../../store/devicesSlice';
import { savePreset, fetchPresets } from '../../store/presetsSlice';
import { toast } from 'react-toastify';
import { ITEM_TYPES } from '../Sidebar/Sidebar';
import LightDevice from '../Devices/LightDevice';
import FanDevice from '../Devices/FanDevice';

const Canvas = () => {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices.devices);
  const presets = useSelector((state) => state.presets.presets);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState('');

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [ITEM_TYPES.DEVICE, ITEM_TYPES.PRESET],
    drop: async (item, monitor) => {
      const dropPosition = monitor.getClientOffset();

      if (item.deviceType) {
        try {
          // Clear existing devices first (only one device at a time)
          if (devices.length > 0) {
            await dispatch(deleteAllDevices()).unwrap();
          }

          // Create the new device
          const deviceData = {
            type: item.deviceType,
            name: `${item.deviceType.charAt(0).toUpperCase() + item.deviceType.slice(1)} Device`,
            settings: getDefaultSettings(item.deviceType),
            position_x: dropPosition?.x || 100,
            position_y: dropPosition?.y || 100,
          };

          await dispatch(createDevice(deviceData)).unwrap();
        } catch (error) {
          console.error('Failed to create device:', error);
          toast.error('Failed to create device. Please try again.');
        }
      } else if (item.preset) {
        try {
          // Get the latest preset data from Redux state instead of using stale dragged data
          const freshPreset = presets.find(p => p.id === item.preset.id);
          if (!freshPreset) {
            toast.error('Preset not found');
            return;
          }

          const presetDevices = freshPreset.devices;

          // Clear existing devices first
          await dispatch(deleteAllDevices()).unwrap();

          // Only load the first device from the preset (since we can only show one at a time)
          if (presetDevices && presetDevices.length > 0) {
            const device = presetDevices[0];
            const deviceData = {
              type: device.type,
              name: device.name || `${device.type.charAt(0).toUpperCase() + device.type.slice(1)} Device`,
              settings: device.settings,
              position_x: device.position?.x || 100,
              position_y: device.position?.y || 100,
            };
            await dispatch(createDevice(deviceData)).unwrap();
          }
        } catch (error) {
          console.error('Failed to load preset:', error);
          toast.error('Failed to load preset. Please try again.');
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const getDefaultSettings = (deviceType) => {
    switch (deviceType) {
      case 'light':
        return {
          brightness: 100,
          colorTemp: 'warm',
        };
      case 'fan':
        return {
          speed: 0,
        };
      default:
        return {};
    }
  };

  const renderDevice = (device) => {
    switch (device.type) {
      case 'light':
        return <LightDevice key={device.id} device={device} />;
      case 'fan':
        return <FanDevice key={device.id} device={device} />;
      default:
        return null;
    }
  };

  const handleClear = async () => {
    if (devices.length === 0) return;

    if (window.confirm('Are you sure you want to clear all devices?')) {
      try {
        await dispatch(deleteAllDevices()).unwrap();
      } catch (error) {
        console.error('Failed to clear devices:', error);
        toast.error('Failed to clear devices. Please try again.');
      }
    }
  };

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      toast.warning('Please enter a preset name');
      return;
    }

    if (devices.length === 0) {
      toast.warning('No devices to save');
      return;
    }

    try {
      // Format devices to only include required fields for backend validation
      const formattedDevices = devices.map(device => ({
        type: device.type,
        name: device.name || `${device.type.charAt(0).toUpperCase() + device.type.slice(1)} Device`,
        settings: device.settings,
      }));

      await dispatch(savePreset({
        name: presetName,
        devices: formattedDevices,
      })).unwrap();

      // Refresh presets list from backend to ensure sidebar shows the newly saved preset
      await dispatch(fetchPresets()).unwrap();

      setPresetName('');
      setShowPresetModal(false);
      toast.success('Preset saved successfully!');
    } catch (error) {
      console.error('Save preset error:', error);
      toast.error('Failed to save preset: ' + (error.message || error));
    }
  };

  return (
    <div className="flex-1 bg-dark-bg h-screen overflow-y-auto flex flex-col scrollbar-custom">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h2 className="m-0 text-xl font-semibold">Testing Canvas</h2>
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            disabled={devices.length === 0}
            className="px-4 py-2 rounded-lg bg-transparent border border-white/20 text-white/70 text-sm font-medium cursor-pointer transition-all hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <button
            onClick={() => setShowPresetModal(true)}
            disabled={devices.length === 0}
            className="px-4 py-2 rounded-lg bg-accent-blue text-white text-sm font-medium cursor-pointer transition-all hover:bg-[#4a9ee0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Preset
          </button>
        </div>
      </div>

      {/* Canvas Content */}
      <div
        ref={drop}
        className={`flex-1 p-6 transition-all ${isOver && canDrop ? 'bg-accent-blue/5' : ''}`}
      >
        {devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 text-white/30 text-center h-full">
            <div
              className={`w-[120px] h-[120px] border-3 border-dashed rounded-full flex items-center justify-center text-6xl transition-all
                ${isOver && canDrop ? 'border-accent-blue text-accent-blue scale-110' : 'border-white/20 text-white/20'}`}
            >
              +
            </div>
            <p className="text-base m-0">Drag and drop devices here to start</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            {devices.map((device) => renderDevice(device))}
          </div>
        )}
      </div>

      {/* Save Preset Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPresetModal(false)}>
          <div className="bg-dark-card rounded-lg p-6 w-[400px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Save Preset</h3>
            <input
              type="text"
              placeholder="Enter preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full bg-dark-border border border-[#4a4e69] rounded-md px-3 py-2.5 text-white text-sm outline-none transition-all
                focus:border-accent-blue focus:shadow-[0_0_0_2px_rgba(94,179,246,0.1)] placeholder:text-white/40 mb-4"
              onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowPresetModal(false);
                  setPresetName('');
                }}
                className="px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all
                  bg-transparent text-white/70 border border-[#4a4e69] hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                className="px-4 py-2 rounded-md border-none text-sm font-medium cursor-pointer transition-all
                  bg-accent-blue text-white hover:bg-[#4a9ee0]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
