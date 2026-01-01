import { useEffect, useState } from 'react';
import API from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { 
    Search, 
    ArrowUpRight, 
    Users, 
    Activity, 
    Clock, 
    ShieldCheck, 
    AlertCircle,
    Plus,
    Filter,
    ArrowRightLeft
} from 'lucide-react'
import Navbar from '../components/Navbar'

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [stats, setStats] = useState({
        totalDonations: 0,
        pendingReviews: 0,
        totalDonors: 0,
        avgDonation: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await API.put(`/admin/donations/${id}/status`, { status: newStatus });
            const [donationsRes, statsRes] = await Promise.all([
                API.get('/admin/donations'),
                API.get('/admin/stats')
            ]);
            setDonations(donationsRes.data.data);
            setStats(statsRes.data.data);
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [donationsRes, statsRes] = await Promise.all([
                    API.get('/admin/donations'),
                    API.get('/admin/stats')
                ]);
                setDonations(donationsRes.data.data);
                setStats(statsRes.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const filteredDonations = donations.filter(d =>
        d.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.campaign?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col gap-6 items-center justify-center h-screen bg-[#020817]">
            <div className="relative">
                <div className="size-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 size-16 border-4 border-transparent border-b-indigo-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Command Center</p>
        </div>
    );

    return (
       <>
       <Navbar/>
        <div className="flex-1 min-h-screen bg-[#020617] text-slate-300 font-['Inter'] selection:bg-blue-500/30">
            {/* --- HEADER --- */}
            <div className="border-b border-slate-800/60 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="size-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            <h2 className="text-xl font-black tracking-tight text-white uppercase italic">System <span className="text-blue-500">Core</span></h2>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Operations Monitor</p>
                    </div>
                    
                    <button
                        onClick={() => navigate('/admin/campaigns')}
                        className="group relative bg-white text-slate-950 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center gap-2 overflow-hidden"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                        Deploy Campaign
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* --- ANALYTICS CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Volume', value: `$${stats.totalDonations.toLocaleString()}`, icon: ArrowUpRight, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Pending Review', value: stats.pendingReviews, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', alert: true },
                        { label: 'Network Donors', value: stats.totalDonors, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { label: 'Avg Ticket', value: `$${stats.avgDonation.toFixed(0)}`, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-[2rem] hover:border-slate-700 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${item.bg} ${item.color} p-3 rounded-2xl`}>
                                    <item.icon size={20} />
                                </div>
                                {item.alert && stats.pendingReviews > 0 && (
                                    <span className="flex size-2 bg-amber-500 rounded-full animate-ping"></span>
                                )}
                            </div>
                            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</h3>
                            <p className="text-3xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* --- TABLE SECTION --- */}
                <div className="bg-slate-900/20 border border-slate-800/60 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                    <div className="p-8 border-b border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 bg-slate-800/50 rounded-2xl flex items-center justify-center text-blue-500">
                                <ArrowRightLeft size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase tracking-widest text-sm">Transaction Ledger</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Flow Decrypt</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                                <Input
                                    className="bg-slate-950/50 border-slate-800 h-12 pl-12 pr-4 rounded-2xl text-xs focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                    placeholder="Search Hash, Donor or Cause..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="size-12 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800/60">
                                    <th className="py-6 px-8">Entity / Source</th>
                                    <th className="py-6 px-8">Destination</th>
                                    <th className="py-6 px-8">Value</th>
                                    <th className="py-6 px-8">Status</th>
                                    <th className="py-6 px-8 text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40">
                                {filteredDonations.map((d, i) => (
                                    <tr key={d._id} className="hover:bg-blue-500/[0.02] group transition-all duration-300">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-black text-[10px] text-white border border-slate-700 shadow-lg group-hover:scale-110 transition-transform">
                                                    {d.donor?.name?.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white mb-0.5">{d.donor?.name}</span>
                                                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{d.donor?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-sm font-bold text-slate-300">
                                            <div className="flex flex-col">
                                                <span className="group-hover:text-blue-400 transition-colors italic">/{d.campaign?.title || 'GENERAL_POOL'}</span>
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{d.category}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <span className="text-sm font-black text-white tabular-nums">${d.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="py-6 px-8">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${
                                                d.status === 'Verified' 
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                                            }`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button
                                                    onClick={() => handleStatusUpdate(d._id, 'Verified')}
                                                    className="size-9 bg-emerald-500 text-slate-950 rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                                                >
                                                    <ShieldCheck size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(d._id, 'Pending')}
                                                    className="size-9 bg-slate-800 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 border border-slate-700 active:scale-95 transition-all"
                                                >
                                                    <AlertCircle size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
       </>
    );
};

export default AdminDashboard;