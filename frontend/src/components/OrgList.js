import React from 'react';

export default function OrgList({orgs, loading, error, onSelect}){
    if(loading) return <div className="bg-white p-4 rounded shadow">Loading organizations...</div>;
    if(error) return <div className="bg-white p-4 rounded shadow text-red-600">{error}</div>;
    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">Organizations</h2>
                <small className="text-sm text-gray-500">{orgs.length}</small>
            </div>
            <ul>
                {orgs.map(o=>(
                    <li key={o.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer" onClick={()=>onSelect(o)}>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-medium">{o.name}</div>
                                <div className="text-sm text-gray-500">{o.description}</div>
                            </div>
                            <div className="text-sm text-gray-400">#{o.id}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}