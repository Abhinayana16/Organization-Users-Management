import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function OrgDetails({org, refreshOrgs, apiBase}){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showNew, setShowNew] = useState(false);
    const [form, setForm] = useState({name:'', email:'', role:'member'});

    useEffect(()=>{ if(org) fetchUsers(org.id); }, [org]);

    async function fetchUsers(orgId){
        setLoading(true); setError(null);
        try{
            const res = await axios.get(apiBase + '/orgs/' + orgId + '/users/');
            setUsers(res.data || []);
        }catch(e){ setError("Failed to load users") }
        finally{ setLoading(false); }
    }

    async function addUser(e){
        e.preventDefault();
        try{
            await axios.post(apiBase + '/orgs/' + org.id + '/users/', form);
            setShowNew(false);
            setForm({name:'', email:'', role:'member'});
            fetchUsers(org.id);
        }catch(e){
            alert("Failed to add user");
        }
    }

    if(!org) return <div className="bg-white p-4 rounded shadow">Select an organization</div>;

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold">{org.name}</h2>
                    <p className="text-sm text-gray-600">{org.description}</p>
                </div>
                <div>
                    <button className="px-3 py-1 bg-brand-500 text-white rounded" onClick={()=>setShowNew(true)}>Add User</button>
                </div>
            </div>

            <div className="mt-5">
                <h3 className="font-medium">Users</h3>
                {loading && <div>Loading users...</div>}
                {error && <div className="text-red-600">{error}</div>}
                <ul className="mt-3">
                    {users.map(u=>(
                        <li key={u.id} className="p-3 border-b last:border-b-0 flex justify-between items-center">
                            <div>
                                <div className="font-medium">{u.name}</div>
                                <div className="text-sm text-gray-500">{u.email} • {u.role}</div>
                            </div>
                            <div>
                                <span className={"px-2 py-1 rounded text-sm " + (u.active ? "bg-green-100 text-green-800":"bg-gray-100 text-gray-600")}>
                                    {u.active ? "Active":"Inactive"}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {showNew && (
                <div className="mt-4 border-t pt-4">
                    <form onSubmit={addUser} className="space-y-3 max-w-md">
                        <input required className="w-full p-2 border rounded" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
                        <input required type="email" className="w-full p-2 border rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
                        <select className="w-full p-2 border rounded" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-brand-500 text-white rounded">Add</button>
                            <button type="button" className="px-4 py-2 border rounded" onClick={()=>setShowNew(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}