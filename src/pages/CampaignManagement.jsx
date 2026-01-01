import React, { useState, useEffect } from 'react';
import API from '@/api/axios';
import { toast, Toaster } from 'react-hot-toast'; // Toast import kiya
import { 
    PlusCircle, Sparkles, Trash2, Edit3, BarChart3, 
    Calendar as CalendarIcon, Target, Layers, Search, Zap, TrendingUp 
} from 'lucide-react';
import Navbar from '../components/Navbar'

const CampaignManagement = () => {
    // Form State
    const [title, setTitle] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [defaultCategory, setDefaultCategory] = useState('General');

    // UI & Data State
    const [campaigns, setCampaigns] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = async () => {
        try {
            const res = await API.get('/campaigns');
            setCampaigns(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to sync with command center"); // Error Toast
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleAiAssist = async () => {
        if (!title || !goalAmount) {
            toast.error("Provide title and goal for AI analysis", {
                style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
            });
            return;
        }
        setIsGenerating(true);
        toast.loading("Analyzing mission parameters...", { id: 'ai-load' }); // Loading Toast
        
        setTimeout(() => {
            toast.success("Intelligence report generated", { id: 'ai-load' });
            setIsGenerating(false);
        }, 1500); 
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        const publishToast = toast.loading("Deploying mission...");
        try {
            const newCampaign = { title, goalAmount: Number(goalAmount), description, deadline, defaultCategory };
            await API.post('/campaigns/create', newCampaign);
            
            setTitle(''); setGoalAmount(''); setDescription(''); setDeadline(''); setDefaultCategory('General');
            fetchCampaigns();
            
            toast.success("Mission Launched Successfully!", { id: publishToast });
        } catch (err) {
            toast.error(err.response?.data?.message || "Deployment failed", { id: publishToast });
        }
    };

    const handleDeleteCampaign = async (id) => {
        // Simple confirm remains for safety, but response is Toast
        if (!window.confirm("Abort this mission? This action is irreversible.")) return;
        
        const deleteToast = toast.loading("Terminating deployment...");
        try {
            await API.delete(`/campaigns/${id}`);
            fetchCampaigns();
            toast.success("Mission Terminated", { id: deleteToast });
        } catch (err) {
            toast.error("Termination failed", { id: deleteToast });
        }
    };

    return (
       <>
       <Navbar/>
        <div className="flex-1 min-h-screen bg-[#020617] text-slate-300 font-['Inter'] p-4 md:p-8 relative overflow-hidden">
            
            {/* Toast Container - Isse kahi bhi render kiya ja sakta hai */}
            <Toaster 
                position="top-right" 
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#0f172a',
                        color: '#fff',
                        border: '1px solid #1e293b',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em'
                    },
                    success: {
                        iconTheme: { primary: '#10b981', secondary: '#fff' }
                    },
                    error: {
                        iconTheme: { primary: '#ef4444', secondary: '#fff' }
                    }
                }}
            />

            {/* --- CYBER GRID BACKGROUND --- */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            
            {/* Background Glows */}
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-800/60 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-emerald-500 mb-2">
                            <Zap size={20} className="fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Operational Status: Active</span>
                        </div>
                        <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Control</span>
                        </h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Strategic Asset Deployment Interface</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl px-8 py-4 flex items-center gap-6">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-2">
                                    <Target size={10} /> Cumulative Goal
                                </p>
                                <p className="text-2xl font-black text-white italic tracking-tighter">
                                    ${campaigns.reduce((acc, c) => acc + (c.goalAmount || 0), 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="h-10 w-px bg-slate-800" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1 flex items-center gap-2">
                                    <TrendingUp size={10} /> Impact Generated
                                </p>
                                <p className="text-2xl font-black text-emerald-400 italic tracking-tighter">
                                    ${campaigns.reduce((acc, c) => acc + (c.raisedAmount || 0), 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* FORM SECTION */}
                    <div className="lg:col-span-4">
                        <div className="bg-slate-900/30 backdrop-blur-2xl rounded-[2rem] border border-slate-800 p-8 shadow-2xl relative group">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                    <PlusCircle size={18} className="text-emerald-500" /> Initialize Mission
                                </h3>
                            </div>

                            <form className="space-y-6" onSubmit={handlePublish}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Asset Designation</label>
                                    <input
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-5 py-4 outline-none focus:border-emerald-500/50 text-white font-bold"
                                        placeholder="MISSION_TITLE"
                                        type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Capital Target</label>
                                        <input
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-5 py-4 outline-none focus:border-emerald-500/50 text-white font-mono"
                                            placeholder="0.00" type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Termination</label>
                                        <input
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-5 py-4 outline-none focus:border-emerald-500/50 text-white color-scheme-dark text-xs"
                                            type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Sector Classification</label>
                                    <select
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-5 py-4 outline-none focus:border-emerald-500/50 text-white font-bold appearance-none"
                                        value={defaultCategory} onChange={(e) => setDefaultCategory(e.target.value)}
                                    >
                                        <option value="General">GENERAL_RELIEF</option>
                                        <option value="Food">FOOD_SECURITY</option>
                                        <option value="Medical">HEALTHCARE_CORE</option>
                                        <option value="Education">INTEL_EDUCATION</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1 mb-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mission Parameters</label>
                                        <button 
                                            type="button" onClick={handleAiAssist}
                                            className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                                        >
                                            <Sparkles size={10} /> AI Assist
                                        </button>
                                    </div>
                                    <textarea
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-5 py-4 min-h-[140px] outline-none focus:border-emerald-500/50 text-white resize-none text-sm"
                                        placeholder="Detailed operational intelligence..."
                                        value={description} onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <button className="w-full group relative h-16 rounded-xl bg-white overflow-hidden transition-all active:scale-[0.97]" type="submit">
                                    <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="relative z-10 text-slate-950 font-black uppercase tracking-[0.2em] text-xs group-hover:text-white transition-colors">Launch Deployment</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* LIST SECTION */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm flex items-center gap-3">
                                <div className="size-1.5 bg-emerald-500 rounded-full animate-ping" /> Active Operations
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="py-24 text-center">
                                    <div className="size-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">Syncing Nodes...</p>
                                </div>
                            ) : campaigns.map((c, idx) => (
                                <div key={c._id} className="group relative bg-slate-900/20 hover:bg-slate-900/40 border border-slate-800/60 hover:border-emerald-500/30 rounded-[2rem] p-8 transition-all duration-500">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
                                        <div className="flex-1 space-y-4 w-full">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10">ID: OPS_{idx + 101}</span>
                                                    <h4 className="text-white font-black text-2xl tracking-tight group-hover:text-emerald-400 transition-colors">{c.title}</h4>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="size-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-slate-700/50">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteCampaign(c._id)}
                                                        className="size-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-red-500 transition-all border border-slate-700/50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-6 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                                <div className="flex items-center gap-2"><CalendarIcon size={14} /> {c.deadline ? new Date(c.deadline).toLocaleDateString() : 'NO_EXPIRY'}</div>
                                                <div className="flex items-center gap-2 text-emerald-500/80"><Target size={14} /> {((c.raisedAmount / c.goalAmount) * 100).toFixed(1)}% COMPLETE</div>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-64 space-y-3 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50">
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-black text-slate-600 uppercase">Funding</p>
                                                    <p className="text-xl font-black text-white italic tracking-tighter">${c.raisedAmount.toLocaleString()}</p>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-500 tracking-tighter">OF ${c.goalAmount.toLocaleString()}</p>
                                            </div>
                                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-1000" 
                                                    style={{ width: `${Math.min(100, (c.raisedAmount / c.goalAmount) * 100)}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
       </>
    );
};

export default CampaignManagement;