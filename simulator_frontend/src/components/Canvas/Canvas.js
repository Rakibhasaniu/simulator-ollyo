import React from 'react';
import { useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { createDevice, deleteAllDevices } from '../../store/devicesSlice';
import { ITEM_TYPES } from '../Sidebar/Sidebar';
import LightDevice from '../Devices/LightDevice';
import FanDevice from '../Devices/FanDevice';

const Canvas = () => {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices.devices);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [ITEM_TYPES.DEVICE, ITEM_TYPES.PRESET],
    drop: async (item, monitor) => {
      const dropPosition = monitor.getClientOffset();

      if (item.deviceType) {
        const deviceData = {
          type: item.deviceType,
          name: `${item.deviceType.charAt(0).toUpperCase() + item.deviceType.slice(1)} Device`,
          settings: getDefaultSettings(item.deviceType),
          position_x: dropPosition?.x || 100,
          position_y: dropPosition?.y || 100,
        };

        try {
          await dispatch(createDevice(deviceData)).unwrap();
        } catch (error) {
          console.error('Failed to create device:', error);
          alert('Failed to create device. Please try again.');
        }
      } else if (item.preset) {
        try {
          const presetDevices = item.preset.devices;

          await dispatch(deleteAllDevices()).unwrap();

          for (const device of presetDevices) {
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
          alert('Failed to load preset. Please try again.');
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
          power: false,
          brightness: 100,
          colorTemp: 'warm',
        };
      case 'fan':
        return {
          power: false,
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

  return (
    <div
      ref={drop}
      className={`flex-1 bg-dark-bg h-screen overflow-y-auto p-5 flex flex-col transition-all scrollbar-custom
        ${isOver && canDrop ? 'bg-accent-blue/5 border-2 border-dashed border-accent-blue' : ''}`}
    >
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
        <h2 className="m-0 text-2xl font-semibold">Sandbox</h2>
        <div className="text-sm text-white/60 bg-dark-card px-4 py-2 rounded-full">
          {devices.length} device{devices.length !== 1 ? 's' : ''} active
        </div>
      </div>

      <div className="flex-1">
        {devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 text-white/30 text-center min-h-[400px]">
            <div
              className={`w-[120px] h-[120px] border-3 border-dashed rounded-full flex items-center justify-center text-6xl transition-all
                ${isOver && canDrop ? 'border-accent-blue text-accent-blue scale-110' : 'border-white/20 text-white/20'}`}
            >
              +
            </div>
            <p className="text-base m-0">Drag and drop devices here to start</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
            {devices.map((device) => renderDevice(device))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
