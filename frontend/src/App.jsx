import React from 'react';
import CreateLog from './pages/CreateLog';
import ListLogs from './pages/ListLogs';

export default function App(){
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">ระบบบันทึก Log ปัญหา</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CreateLog />
        <ListLogs />
      </div>
    </div>
  );
}
