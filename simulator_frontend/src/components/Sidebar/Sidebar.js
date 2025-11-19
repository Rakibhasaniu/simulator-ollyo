import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { savePreset, deletePreset } from '../../store/presetsSlice';
import { FaLightbulb, FaFan, FaSave, FaTrash } from 'react-icons/fa';

const ITEM_TYPES = {
  DEVICE: 'device',
  PRESET: 'preset',
};

const DraggableDevice = ({ type, icon, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPES.DEVICE,
    item: { deviceType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-dark-card border-2 border-dark-border rounded-lg p-4 flex items-center gap-3 cursor-grab transition-all select-none
        hover:border-accent-blue hover:bg-[#1e2236] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(94,179,246,0.2)]
        ${isDragging ? 'opacity-50 cursor-grabbing' : ''}`}
    >
      <div className="text-2xl text-accent-blue flex items-center justify-center">{icon}</div>
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
};

const DraggablePreset = ({ preset, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPES.PRESET,
    item: { preset },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(preset.id);
  };

  return (
    <div
      ref={drag}
      className={`bg-dark-card border-2 border-dark-border rounded-lg p-3 flex items-center justify-between cursor-grab transition-all select-none
        hover:border-accent-blue hover:bg-[#1e2236] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(94,179,246,0.2)]
        ${isDragging ? 'opacity-50 cursor-grabbing' : ''}`}
    >
      <div className="flex flex-col gap-1 flex-1">
        <div className="text-sm font-medium">{preset.name}</div>
        <div className="text-xs text-white/50">
          {Array.isArray(preset.devices) ? preset.devices.length : 0} devices
        </div>
      </div>
      <button
        className="bg-transparent border-none text-accent-red cursor-pointer p-1.5 rounded transition-all hover:bg-red-500/10 hover:scale-110"
        onClick={handleDelete}
      >
        <FaTrash />
      </button>
    </div>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices.devices);
  const presets = useSelector((state) => state.presets.presets || []);
  const [presetName, setPresetName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      alert('Please enter a preset name');
      return;
    }

    if (devices.length === 0) {
      alert('No devices to save');
      return;
    }

    try {
      await dispatch(savePreset({
        name: presetName,
        devices: devices,
      })).unwrap();

      setPresetName('');
      setShowSaveForm(false);
      alert('Preset saved successfully!');
    } catch (error) {
      alert('Failed to save preset: ' + error);
    }
  };

  const handleDeletePreset = async (presetId) => {
    if (window.confirm('Are you sure you want to delete this preset?')) {
      try {
        await dispatch(deletePreset(presetId)).unwrap();
      } catch (error) {
        alert('Failed to delete preset: ' + error);
      }
    }
  };

  return (
    <div className="bg-dark-sidebar w-[280px] h-screen overflow-y-auto p-5 border-r border-white/10 flex flex-col gap-6 scrollbar-custom">
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h2 className="m-0 text-lg font-semibold">Essential UI Element</h2>
      </div>

      {/* Device Library - Light */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[13px] font-medium text-white/60 uppercase tracking-wide m-0">
          Light Control Panel
        </h3>
        <div className="flex flex-col gap-2.5">
          <DraggableDevice
            type="light"
            icon={<FaLightbulb />}
            label="Light"
          />
        </div>
      </div>

      {/* Device Library - Fan */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[13px] font-medium text-white/60 uppercase tracking-wide m-0">
          Controls for Fan
        </h3>
        <div className="flex flex-col gap-2.5">
          <DraggableDevice
            type="fan"
            icon={<FaFan />}
            label="Fan"
          />
        </div>
      </div>

      {/* Preset Management */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-[13px] font-medium text-white/60 uppercase tracking-wide m-0">
            Saved Presets
          </h3>
          <button
            className="bg-accent-blue border-none text-white w-8 h-8 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-[#4a9ee0] hover:scale-105"
            onClick={() => setShowSaveForm(!showSaveForm)}
            title="Save current configuration"
          >
            <FaSave />
          </button>
        </div>

        {/* Save Preset Form */}
        {showSaveForm && (
          <div className="bg-dark-card rounded-lg p-4 flex flex-col gap-2.5">
            <input
              type="text"
              placeholder="Enter preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="bg-dark-border border border-[#4a4e69] rounded-md px-3 py-2.5 text-white text-sm outline-none transition-all
                focus:border-accent-blue focus:shadow-[0_0_0_2px_rgba(94,179,246,0.1)] placeholder:text-white/40"
              onKeyPress={(e) => e.key === 'Enter' && handleSavePreset()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSavePreset}
                className="flex-1 px-3 py-2 rounded-md border-none text-[13px] font-medium cursor-pointer transition-all
                  bg-accent-blue text-white hover:bg-[#4a9ee0]"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveForm(false);
                  setPresetName('');
                }}
                className="flex-1 px-3 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-all
                  bg-transparent text-white/70 border border-[#4a4e69] hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Presets List */}
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-custom">
          {presets.length === 0 ? (
            <div className="text-center py-5 text-white/40 text-[13px]">No saved presets</div>
          ) : (
            presets.map((preset) => (
              <DraggablePreset
                key={preset.id}
                preset={preset}
                onDelete={handleDeletePreset}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
export { ITEM_TYPES };
