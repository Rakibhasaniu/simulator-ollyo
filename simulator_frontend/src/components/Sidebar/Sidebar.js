import { useDrag } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { deletePreset } from '../../store/presetsSlice';
import { deleteAllDevices } from '../../store/devicesSlice';
import { toast } from 'react-toastify';
import { FaLightbulb, FaFan, FaTrash } from 'react-icons/fa';
import { useState } from 'react';

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
          {Array.isArray(preset.devices) && preset.devices.length > 0
            ? `${preset.devices[0].type.charAt(0).toUpperCase() + preset.devices[0].type.slice(1)}`
            : 'No device'}
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
  const presets = useSelector((state) => state.presets.presets || []);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const handleDeletePreset = async (presetId) => {
    const preset = presets.find(p => p.id === presetId);
    setDeleteConfirmation({ presetId, presetName: preset?.name || 'this preset' });
  };

  const handleConfirmDelete = async (clearCanvas) => {
    const { presetId } = deleteConfirmation;

    try {
      await dispatch(deletePreset(presetId)).unwrap();

      if (clearCanvas) {
        await dispatch(deleteAllDevices()).unwrap();
      }

      setDeleteConfirmation(null);
      toast.success('Preset deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete preset: ' + error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
  };

  return (
    <div className="bg-dark-sidebar w-[240px] h-screen overflow-y-auto p-4 border-r border-white/10 flex flex-col gap-6 scrollbar-custom">
      {/* Devices Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-white/70 m-0">
          Devices
        </h3>
        <div className="flex flex-col gap-2">
          <DraggableDevice
            type="light"
            icon={<FaLightbulb />}
            label="Light"
          />
          <DraggableDevice
            type="fan"
            icon={<FaFan />}
            label="Fan"
          />
        </div>
      </div>

      {/* Saved Presets Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-white/70 m-0">
          Saved Presets
        </h3>

        {/* Presets List */}
        <div className="flex flex-col gap-2">
          {presets.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-xs">Nothing added yet</div>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-dark-card border-2 border-dark-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold mb-3">Delete Preset</h3>
            <p className="text-sm text-white/70 mb-6">
              Are you sure you want to delete "{deleteConfirmation.presetName}"?
            </p>
            <p className="text-sm text-white/60 mb-6">
              Do you also want to clear all devices from the canvas?
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleConfirmDelete(true)}
                className="bg-accent-red hover:bg-accent-red/80 text-white px-4 py-2.5 rounded-lg font-medium transition-all"
              >
                Delete Preset & Clear Canvas
              </button>
              <button
                onClick={() => handleConfirmDelete(false)}
                className="bg-accent-blue hover:bg-accent-blue/80 text-white px-4 py-2.5 rounded-lg font-medium transition-all"
              >
                Delete Preset Only
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-transparent border border-dark-border hover:bg-white/5 text-white px-4 py-2.5 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
export { ITEM_TYPES };
