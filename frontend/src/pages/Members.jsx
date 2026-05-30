import React from 'react';

const Members = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Members</h1>
        <button className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors">
          Add Member
        </button>
      </div>
      
      <div className="glass-card">
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg mb-2">Member directory is empty or loading...</p>
          <p className="text-sm">Add members to see them listed here.</p>
        </div>
      </div>
    </div>
  );
};

export default Members;
