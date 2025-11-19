import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { fetchPresets } from './store/presetsSlice';
import { fetchDevices } from './store/devicesSlice';
import Sidebar from './components/Sidebar/Sidebar';
import Canvas from './components/Canvas/Canvas';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPresets());
    dispatch(fetchDevices());
  }, [dispatch]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Sidebar />
        <Canvas />
      </div>
    </DndProvider>
  );
}

export default App;
