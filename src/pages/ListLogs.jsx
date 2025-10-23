import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ListLogs(){
  const [logs, setLogs] = useState([]);

  const load = () => {
    axios.get('/api/logs').then(r=>setLogs(r.data)).catch(()=>{});
  };

  useEffect(()=>{
    load();
    const h = () => load();
    window.addEventListener('reloadLogs', h);
    return ()=> window.removeEventListener('reloadLogs', h);
  },[]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">รายการ Log ล่าสุด</h2>
      <div className="space-y-2 max-h-96 overflow-auto">
        {logs.map(l=> (
          <div key={l.id} className="border p-2 rounded">
            <div className="text-sm text-gray-500">{new Date(l.createdAt).toLocaleString('th-TH')}</div>
            <div className="font-medium">{l.Problem?.name || '-'}</div>
            <div>Tag: {l.deviceTag}</div>
            <div>สถานที่: {l.Location?.label}</div>
            <div>ผู้แจ้ง: {l.User?.displayName || l.User?.username}</div>
            <div className="text-sm">หมายเหตุ: {l.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
