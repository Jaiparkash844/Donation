import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';
import { 
    LayoutDashboard, 
    ShieldCheck, 
    Heart, 
    TrendingUp, 
    Download, 
    History, 
    ArrowUpRight,
    Zap,
    User
} from 'lucide-react';
import Navbar from '../components/Navbar'
const UserDashboard = () => {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, count: 0 });

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await API.get('/donations/my-donations');
                const donationData = response.data.data;
                setDonations(donationData);
                const totalImpact = donationData.reduce((acc, curr) => acc + curr.amount, 0);
                setStats({ total: totalImpact, count: donationData.length });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleDownloadReceipt = (donation) => {
        const receiptContent = `--- SESSION RECEIPT ---\nDate: ${new Date(donation.createdAt).toLocaleDateString()}\nDonor: ${user.name}\nAmount: $${donation.amount.toFixed(2)}\nCategory: ${donation.category}\nStatus: VERIFIED`;
        const element = document.createElement("a");
        const file = new Blob([receiptContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Receipt_${donation._id}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    if (loading) return (
        <div className="flex flex-col gap-6 items-center justify-center h-screen bg-[#020617]">
            <div className="size-14 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Decrypting_User_Data...</p>
        </div>
    );

    return (
      <>
            <Navbar/>
        <div className="flex-1 min-h-screen bg-[#020617] text-slate-300 font-['Inter'] p-4 md:p-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Admin Access Panel */}
                {isAdmin && (
                  <div className="mb-10 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Admin Privilege Detected</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter italic">Accessing restricted management nodes enabled.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="w-full md:w-auto px-6 py-2.5 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
                            >
                            Open_Admin_Console
                        </button>
                    </div>
                )}

                {/* Profile Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-500 mb-1">
                            <User size={16} />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Identity_Verified</span>
                        </div>
                        <h2 className="text-white text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">{user?.name.split(' ')[0]}</span>
                        </h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">
                            Node Activity: <span className="text-slate-300">{stats.count} Successful Operations</span>
                        </p>
                    </div>
                    
                    <button
                        onClick={() => navigate('/donate')}
                        className="group relative flex items-center justify-center gap-3 h-14 px-8 rounded-xl bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] overflow-hidden"
                        >
                        <Heart size={16} className="fill-current text-rose-500" />
                        <span>Initialize_New_Mission</span>
                        <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10" />
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    <div className="lg:col-span-2 relative bg-slate-900/40 border border-slate-800 rounded-3xl p-8 overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={120} />
                        </div>
                        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                            <Zap size={14} className="text-emerald-500" /> Accumulated_Impact_Value
                        </p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl md:text-7xl font-black text-white tracking-tighter italic">
                                ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                                Status: Net_Positive
                            </div>
                            <div className="text-slate-600 text-[9px] font-black uppercase tracking-widest">
                                Efficiency_Rating: 100%
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-500 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-emerald-500/10 group relative overflow-hidden">
                        <div className="absolute -bottom-6 -right-6 text-slate-950/10 rotate-12">
                            <LayoutDashboard size={140} />
                        </div>
                        <div>
                            <p className="text-slate-950/60 font-black uppercase tracking-widest text-[10px] mb-1">Mission_Count</p>
                            <p className="text-6xl font-black text-slate-950 italic">{stats.count}</p>
                        </div>
                        <p className="text-[10px] text-slate-900 font-black uppercase tracking-widest leading-relaxed mt-8 flex items-center gap-2">
                            Active_Contribution_Cycle <ArrowUpRight size={14} />
                        </p>
                    </div>
                </div>

                {/* Recent Donations Table */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <History size={18} className="text-emerald-500" />
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Operation_Logs</h3>
                    </div>

                    <div className="bg-slate-950/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900/50 border-b border-slate-800 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                                        <th className="py-5 px-8">Timestamp</th>
                                        <th className="py-5 px-8">Target_Mission</th>
                                        <th className="py-5 px-8">Capital_Allocated</th>
                                        <th className="py-5 px-8">Validation_Status</th>
                                        <th className="py-5 px-8 text-right">Extraction</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/40">
                                    {donations.length > 0 ? donations.map((d, i) => (
                                      <tr key={d._id} className="group hover:bg-emerald-500/[0.02] transition-colors">
                                            <td className="py-5 px-8 text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                                                {new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-slate-200 uppercase italic tracking-tight">{d.campaign?.title || 'GENERAL_FUND_RESERVE'}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60">{d.category}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8 text-sm font-black text-white italic tracking-tighter">
                                                ${d.amount.toFixed(2)}
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${
                                                  d.status === 'Verified' 
                                                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' 
                                                  : 'bg-amber-500/5 border-amber-500/20 text-amber-500'
                                                }`}>
                                                    <span className={`size-1 rounded-full bg-current ${d.status === 'Verified' ? '' : 'animate-pulse'}`} />
                                                    {d.status}
                                                </div>
                                            </td>
                                            <td className="py-5 px-8 text-right">
                                                <button
                                                    onClick={() => handleDownloadReceipt(d)}
                                                    className="size-8 bg-slate-900 border border-slate-800 text-slate-500 hover:text-emerald-500 hover:border-emerald-500/50 rounded flex items-center justify-center ml-auto transition-all"
                                                    >
                                                    <Download size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                      <tr>
                                            <td colSpan="5" className="py-20 text-center">
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">No_Active_Logs_Found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                                          </>
    );
};

export default UserDashboard;