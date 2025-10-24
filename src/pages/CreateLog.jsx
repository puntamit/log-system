import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';

export default function CreateLog(){
  const [problems, setProblems] = useState([]);
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ problemId:'', deviceTag:'', locationId:'', userId:'', note:'' });

  useEffect(()=>{
    axios.get('/api/problems').then(r=>setProblems(r.data)).catch(()=>{});
    axios.get('/api/users').then(r=>setUsers(r.data)).catch(()=>{});
    axios.get('/api/locations').then(r=>setLocations(r.data)).catch(()=>{});
  },[]);

  // ✅ ฟังก์ชันเพิ่มสถานที่ใหม่
  const handleAddLocation = async (newValue) => {
    try {
      const newLoc = { label: newValue, building: '-', department: '-', floor: '-' };
      const res = await axios.post('/api/locations', newLoc);
      setLocations([...locations, res.data]);
      setForm({ ...form, locationId: res.data.id });
    } catch (err) {
      alert('เพิ่มสถานที่ไม่สำเร็จ');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/logs', form);
      alert('บันทึกสำเร็จ');
      setForm({ problemId:'', deviceTag:'', locationId:'', userId:'', note:'' });
      window.dispatchEvent(new Event('reloadLogs'));
    } catch (err) {
      alert('เกิดข้อผิดพลาด');
    }
  };

  const exportExcel = () => {
    window.location.href = '/api/export';
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">บันทึกปัญหา</h2>

      <label className="block text-sm">ปัญหาที่พบ</label>
      <select required value={form.problemId} onChange={e=>setForm({...form, problemId:e.target.value})} className="w-full p-2 border rounded mb-2">
        <option value="">-- เลือก --</option>
        {problems.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      <label className="block text-sm">Tag (เลขอุปกรณ์)</label>
      <input required value={form.deviceTag} onChange={e=>setForm({...form, deviceTag:e.target.value})} className="w-full p-2 border rounded mb-2" />

      {/* ✅ ส่วนสถานที่แบบพิมพ์เพิ่มได้ */}
      <label className="block text-sm">สถานที่</label>
      <CreatableSelect
        className="mb-2"
        placeholder="เลือกหรือพิมพ์เพิ่ม..."
        value={locations.find(l => l.id === form.locationId) ? { value: form.locationId, label: locations.find(l => l.id === form.locationId)?.label } : null}
        onChange={(selected) => {
          setForm({ ...form, locationId: selected ? selected.value : '' });
        }}
        onCreateOption={handleAddLocation}
        options={locations.map(l => ({ value: l.id, label: l.label }))}
      />

      <label className="block text-sm">ผู้แจ้ง</label>
      <select required value={form.userId} onChange={e=>setForm({...form, userId:e.target.value})} className="w-full p-2 border rounded mb-2">
        <option value="">-- เลือก --</option>
        {users.map(u=> <option key={u.id} value={u.id}>{u.displayName || u.username}</option>)}
      </select>

      <label className="block text-sm">หมายเหตุ</label>
      <textarea value={form.note} onChange={e=>setForm({...form, note:e.target.value})} className="w-full p-2 border rounded mb-2" />

      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">บันทึก</button>
        <button type="button" onClick={exportExcel} className="px-4 py-2 bg-green-600 text-white rounded">Export Excel</button>
      </div>
    </form>
  );
}
