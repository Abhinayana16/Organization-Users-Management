import React, {useEffect, useState} from 'react';
import axios from 'axios';
import OrgList from './components/OrgList';
import OrgDetails from './components/OrgDetails';

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function App(){
    const [orgs, setOrgs] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(()=>{ fetchOrgs(); },[]);

    async function fetchOrgs(){
        setLoading(true);
        try{
            const res = await axios.get(API + '/orgs/');
            setOrgs(res.data);
        }catch(e){ setError("Failed to load organizations") }
        finally{ setLoading(false) }
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Organization & Users Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                    <OrgList orgs={orgs} loading={loading} error={error} onSelect={setSelected} />
                </div>
                <div className="md:col-span-2">
                    <OrgDetails org={selected} refreshOrgs={fetchOrgs} apiBase={API} />
                </div>
            </div>
        </div>
    );
}