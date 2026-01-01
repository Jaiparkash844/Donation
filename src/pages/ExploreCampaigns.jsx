import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';
import { 
    Zap, 
    Target, 
    TrendingUp, 
    ArrowRight, 
    Calendar, 
    Activity,
    ShieldAlert
} from 'lucide-react';
import Navbar from '../components/Navbar'

const ExploreCampaigns = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await API.get('/campaigns');
                setCampaigns(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching campaigns:", err);
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    if (loading) return (
        <div className="flex flex-col gap-6 items-center justify-center h-screen bg-[#020617]">
            <div className="size-14 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing_Active_Nodes...</p>
        </div>
    );

    return (
       <>
       <Navbar/>
        <div className="flex-1 min-h-screen bg-[#020617] text-slate-300 font-['Inter'] p-4 md:p-8 relative overflow-hidden">
            
            {/* --- CYBER GRID BACKGROUND --- */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-800/60 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-emerald-500 mb-2">
                            <Activity size={20} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Network Feed</span>
                        </div>
                        <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                            Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Missions</span>
                        </h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Strategic Relief Operations - Real-time Status</p>
                    </div>

                    <div className="hidden md:flex gap-4">
                        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl px-6 py-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Operations</p>
                            <p className="text-2xl font-black text-white italic">{campaigns.length}</p>
                        </div>
                    </div>
                </div>

                {/* --- CAMPAIGNS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.length > 0 ? campaigns.map((campaign, i) => (
                        <div
                            key={campaign._id}
                            className="group relative bg-slate-900/30 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/40 rounded-[2rem] overflow-hidden transition-all duration-500 flex flex-col h-full"
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full group-hover:bg-emerald-500/10 transition-all" />

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="size-11 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
                                        <Zap size={20} className="fill-current" />
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                        <div className="size-1.5 bg-emerald-500 rounded-full animate-ping" />
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-2 uppercase italic">
                                    {campaign.title}
                                </h3>

                                <p className="text-slate-500 text-xs font-bold leading-relaxed mb-8 line-clamp-3 uppercase tracking-tight">
                                    {campaign.description || "MISSION_DATA_MISSING: Deployment parameters not specified by central command."}
                                </p>

                                {/* Progress Stats */}
                                <div className="mt-auto space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                                                <TrendingUp size={10} /> Funding_Progress
                                            </p>
                                            <p className="text-xl font-black text-white italic tracking-tighter">
                                                ${campaign.raisedAmount.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-[10px] font-black text-emerald-500 tracking-tighter">
                                            {Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}%
                                        </p>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden border border-slate-800">
                                        <div
                                            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-1000 ease-out"
                                            style={{ width: `${Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100)}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest border-t border-slate-800/50 pt-4">
                                        <span className="flex items-center gap-1.5"><Target size={12} /> Target: ${campaign.goalAmount.toLocaleString()}</span>
                                        {campaign.deadline && (
                                            <span className="flex items-center gap-1.5 text-slate-400 font-bold tracking-tighter italic">
                                                <Calendar size={12} /> {new Date(campaign.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="p-6 pt-0">
                                <button
                                    onClick={() => navigate('/donate', { state: { campaign } })}
                                    className="w-full group/btn relative h-14 bg-white rounded-xl overflow-hidden transition-all active:scale-[0.97]"
                                >
                                    <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        <span className="text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] group-hover/btn:text-white transition-colors">
                                            Initialize_Support
                                        </span>
                                        <ArrowRight size={16} className="text-slate-950 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-24 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-4 text-center">
                            <ShieldAlert size={48} className="text-slate-700 mb-2" />
                            <div>
                                <p className="text-lg font-black text-white uppercase tracking-[0.2em]">No Active Missions</p>
                                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-1">All nodes are currently in standby mode.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
       </>
    );
};

export default ExploreCampaigns;