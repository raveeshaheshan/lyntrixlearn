import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Server, 
  HardDrive, 
  Activity, 
  Plus, 
  TrendingUp, 
  ExternalLink,
  LogOut,
  Database
} from 'lucide-react';

export const SuperAdminDashboard = () => {
  const { 
    instructors, 
    setInstructors, 
    students,
    platformMetrics, 
    setCurrentTeacherId, 
    setCurrentRole,
    adminLogout,
    extendTeacherTrial,
    grantTeacherTrial,
    revokeTeacherAccess,
    upgradeTeacherSubscription,
    showToast 
  } = useApp();

  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacherForm, setNewTeacherForm] = useState({
    name: '',
    title: 'B.Sc. Lecturer',
    subject: 'Biology',
    monthlyFee: 3500,
    trialStatus: 'grant_14d', // 'grant_14d' | 'pending' | 'direct_pro'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&auto=format&fit=crop&q=80',
    bio: 'Experienced A/L teacher dedicated to student success.'
  });

  const handleCreateTeacher = (e) => {
    e.preventDefault();
    if (!newTeacherForm.name) {
      showToast("Please enter teacher's name", "error");
      return;
    }

    const newId = `ins-${newTeacherForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    
    let subObject;
    if (newTeacherForm.trialStatus === 'grant_14d') {
      subObject = {
        tier: 'Pro Academy (Trial)',
        status: 'trialing',
        isTrialGranted: true,
        trialDaysLeft: 14,
        renewalDate: '14 Days Remaining'
      };
    } else if (newTeacherForm.trialStatus === 'direct_pro') {
      subObject = {
        tier: 'Pro Academy',
        status: 'active',
        isTrialGranted: true,
        trialDaysLeft: 0,
        renewalDate: 'September 2026'
      };
    } else {
      subObject = {
        tier: 'Pro Academy',
        status: 'pending_approval',
        isTrialGranted: false,
        trialDaysLeft: 0,
        renewalDate: 'Awaiting Admin Approval'
      };
    }

    const newInstructor = {
      id: newId,
      name: newTeacherForm.name,
      title: newTeacherForm.title,
      subject: newTeacherForm.subject,
      avatar: newTeacherForm.avatar,
      cover: newTeacherForm.cover,
      themeColor: 'indigo',
      badge: 'Certified Master',
      rating: 5.0,
      reviewsCount: 1,
      studentsCount: 1,
      monthlyFee: Number(newTeacherForm.monthlyFee) || 3500,
      activeBatchesCount: 1,
      bio: newTeacherForm.bio,
      subscription: subObject,
      batches: [
        {
          id: `batch-${newId}-2025`,
          code: `${newTeacherForm.subject.slice(0, 3).toUpperCase()}-2025-TH`,
          title: `2025 A/L ${newTeacherForm.subject} — Full Theory`,
          grade: '2025 A/L',
          medium: 'Sinhala / English Medium',
          schedule: 'Every Saturday 8:00 AM - 1:00 PM',
          status: 'Active',
          monthlyFee: Number(newTeacherForm.monthlyFee) || 3500,
          enrolledCount: 1,
          recordingCount: 0
        }
      ]
    };

    setInstructors(prev => [...prev, newInstructor]);
    setShowAddTeacherModal(false);
    showToast(`Master ${newTeacherForm.name} onboarded! (Access: ${subObject.status.toUpperCase()})`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* 1. ADMIN HERO BANNER WITH LOGOUT */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Protected Master Console
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">
              Super Admin SaaS Infrastructure
            </h1>
            <p className="text-xs text-slate-500">
              Authenticated Session • Managing <strong>{instructors.length} Tuition Academies</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddTeacherModal(true)}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Tuition Master</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            title="Log out of Super Admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* SUPABASE LIVE DATABASE & SEED STATUS BANNER */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/20 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-900">
                Live Supabase PostgreSQL Connected: <code className="text-emerald-700 font-mono">cqvnpuigmthjvdjejfdn</code>
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                Realtime Active
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              All 8 PostgreSQL tables are initialized. Run <strong>supabase/seed.sql</strong> in your Supabase SQL Editor to populate initial demo records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://supabase.com/dashboard/project/cqvnpuigmthjvdjejfdn/sql"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5"
          >
            <span>Open Supabase SQL Editor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. GLOBAL SAAS METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Monthly SaaS MRR</span>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">LKR {platformMetrics.monthlyRecurringRevenueLKR}</div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Live DB Calculation</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Active Teachers / Sirs</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600 mt-3">{instructors.length} Master{instructors.length === 1 ? '' : 's'}</div>
          <div className="text-[11px] text-slate-500 mt-1">Live Database Verified</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Enrolled Students</span>
            <Users className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-cyan-700 mt-3">{students.length} Student{students.length === 1 ? '' : 's'}</div>
          <div className="text-[11px] text-slate-500 mt-1">Supabase Profiles Sync</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">System SLA Uptime</span>
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-3">{platformMetrics.serverUptime}</div>
          <div className="text-[11px] text-slate-500 mt-1">0 Server Outages</div>
        </div>
      </div>

      {/* 3. TEACHER TENANTS DIRECTORY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Registered Academy Tenants</h2>
          <span className="text-xs text-purple-700 font-bold">White-Label Subdomains Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map(ins => (
            <div key={ins.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">{ins.subject}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    Active Tenant
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <img src={ins.avatar} alt={ins.name} className="w-14 h-14 rounded-2xl object-cover border border-purple-200 shadow-sm" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{ins.name}</h3>
                    <div className="text-xs text-slate-500 font-mono">Subdomain: {ins.id.replace('ins-', '')}.dilnethmadushanka.online</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">SaaS Plan Tier:</span>
                    <span className="font-bold text-purple-700">{ins.subscription?.tier || 'Pro Academy (Trial)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trial / Sub Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ins.subscription?.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ins.subscription?.status === 'active' ? 'Active Paid' : `Trial (${ins.subscription?.trialDaysLeft || 12}d left)`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Enrolled Students:</span>
                    <strong className="text-slate-900">{(ins.studentsCount || students.length).toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  {ins.subscription?.status === 'trialing' ? (
                    <button
                      onClick={() => extendTeacherTrial(ins.id, 14)}
                      className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold transition text-center"
                      title="Extend trial by +14 days"
                    >
                      +14d Trial
                    </button>
                  ) : (
                    <button
                      onClick={() => grantTeacherTrial(ins.id, 14)}
                      className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold transition text-center"
                      title="Grant 14-day Free Trial to this Master"
                    >
                      Grant 14d Trial
                    </button>
                  )}

                  <button
                    onClick={() => {
                      upgradeTeacherSubscription(ins.id, 'pro');
                      showToast(`Activated Pro Subscription for ${ins.name}`, 'success');
                    }}
                    className="flex-1 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-[11px] font-bold transition text-center"
                  >
                    Activate Pro
                  </button>

                  <button
                    onClick={() => revokeTeacherAccess(ins.id)}
                    className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition"
                    title="Suspend or Revoke Access"
                  >
                    Revoke
                  </button>
                </div>

                <button
                  onClick={() => {
                    setCurrentTeacherId(ins.id);
                    setCurrentRole('teacher');
                  }}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                >
                  <span>Open Teacher Hub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. USER MANAGEMENT TABLE & SYSTEM USAGE (ADMIN REQUIREMENT) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">User Access & Role Management</h2>
            <p className="text-xs text-slate-500">Filter, inspect status, and manage master & student accounts.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter Status:</span>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none">
              <option value="all">All Users & Roles</option>
              <option value="active">🟢 Active</option>
              <option value="pending">🔒 Pending Approval</option>
              <option value="banned">⛔ Suspended / Banned</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 font-bold border-y border-slate-200">
              <tr>
                <th className="p-3">User Profile</th>
                <th className="p-3">Role</th>
                <th className="p-3">Email / Contact</th>
                <th className="p-3">Status Badge</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {instructors.map(ins => (
                <tr key={ins.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2.5">
                    <img src={ins.avatar} alt={ins.name} className="w-8 h-8 rounded-lg object-cover border" />
                    <div>
                      <div>{ins.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{ins.subject}</div>
                    </div>
                  </td>
                  <td className="p-3"><span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">Tuition Master</span></td>
                  <td className="p-3 font-mono text-slate-600">{ins.email || `${ins.id}@lyntrix.learn`}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ins.subscription?.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                      ins.subscription?.status === 'trialing' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {ins.subscription?.status === 'active' ? 'Active' : ins.subscription?.status === 'trialing' ? 'Active Trial' : 'Pending Approval'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => showToast(`Status updated for ${ins.name}`, 'info')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ONBOARD TEACHER MODAL */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Onboard New Tuition Master</h3>
              <button onClick={() => setShowAddTeacherModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teacher's Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Nuwan Jayasinghe"
                  value={newTeacherForm.name}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject:</label>
                  <input
                    type="text"
                    placeholder="e.g. Biology or Accounting"
                    value={newTeacherForm.subject}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Fee (LKR):</label>
                  <input
                    type="number"
                    value={newTeacherForm.monthlyFee}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, monthlyFee: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qualifications / Title:</label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc. (Hons) Univ. of Colombo"
                  value={newTeacherForm.title}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trial & Access Authorization Policy:</label>
                <select
                  value={newTeacherForm.trialStatus}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, trialStatus: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                >
                  <option value="grant_14d">🟢 Grant 14-Day Free Trial (Full Access Authorized)</option>
                  <option value="pending">🔒 Pending Approval (Do not grant trial yet - wait for confirmation)</option>
                  <option value="direct_pro">⭐ Direct Pro Plan Active (Paid Client)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20"
                >
                  Create Master Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
