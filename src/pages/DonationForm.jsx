import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '@/api/axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
    Heart, ShieldCheck, DollarSign, ArrowRight, 
    Download, Zap, Target, LayoutGrid, CreditCard, 
    Banknote, Wallet 
} from 'lucide-react';
import Navbar from '../components/Navbar'

const DonationForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [amount, setAmount] = useState('50');
    const [donationType, setDonationType] = useState('Zakat');
    const [category, setCategory] = useState(location.state?.campaign?.defaultCategory || '');
    const [paymentMethod, setPaymentMethod] = useState('Online');
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(location.state?.campaign?._id || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const chips = ['10', '50', '100', '200', 'Custom'];

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await API.get('/campaigns');
                setCampaigns(res.data.data);
            } catch (err) {
                toast.error("COMM_LINK_FAILURE");
            }
        };
        fetchCampaigns();
    }, []);

    const handleDownloadReceipt = (donation) => {
        const user = JSON.parse(localStorage.getItem('user')) || { name: 'OPERATIVE' };
        const receiptContent = `--- MISSION RECEIPT ---\nDonor: ${user.name}\nAmount: $${donation.amount}\nStatus: VERIFIED`;
        const element = document.createElement("a");
        const file = new Blob([receiptContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Receipt_${donation._id || 'new'}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleSubmit = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error("INVALID_AMOUNT");
            return;
        }
        setIsSubmitting(true);
        const tid = toast.loading("PROCESSING...");
        try {
            const donationData = { amount: Number(amount), type: donationType, category: category || 'General', paymentMethod, campaignId: selectedCampaign || null };
            const response = await API.post('/donations/submit', donationData);
            toast.success("MISSION_SUCCESS", { id: tid });
             handleDownloadReceipt(response.data.data);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            toast.error("TRANSFER_FAILED", { id: tid });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <Navbar/>
        <div className="flex-1 min-h-screen bg-[#020617] text-slate-300 font-['Inter'] p-4 md:p-6 relative overflow-hidden">
            <Toaster position="top-right" toastOptions={{ style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b', fontSize: '12px' }}} />

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:35px_35px] opacity-10" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full" />

            <div className="max-w-5xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-slate-800/50 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-500 mb-1">
                            <Zap size={16} className="fill-current" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Protocol Delta-09</span>
                        </div>
                        <h2 className="text-white text-3xl font-black tracking-tighter uppercase italic">
                            Power <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Allocation</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 border border-slate-800 px-3 py-1.5 rounded-lg bg-slate-900/50 uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-emerald-500" /> Secure_Link: Active
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Amount Input */}
                        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <DollarSign size={14} className="text-emerald-500" /> Capital_Amount
                            </p>
                            <div className="relative mb-6">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-emerald-500/40">$</span>
                                <input
                                    id="amount-input"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl h-14 pl-12 pr-6 text-2xl font-black text-white focus:border-emerald-500/50 outline-none transition-all"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {chips.map(val => (
                                    <button
                                        key={val}
                                        onClick={() => val === 'Custom' ? document.getElementById('amount-input').focus() : setAmount(val)}
                                        className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border ${
                                            (amount === val || (val === 'Custom' && !['10', '50', '100', '200'].includes(amount)))
                                            ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/20'
                                            : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600'
                                        }`}
                                    >
                                        {val === 'Custom' ? 'Custom' : `$${val}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mission Config */}
                        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Target size={14} className="text-emerald-500" /> Config_Parameters
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Mission_Target</label>
                                    <select
                                        value={selectedCampaign}
                                        onChange={(e) => setSelectedCampaign(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl h-12 px-4 text-[11px] font-bold text-white outline-none focus:border-emerald-500/40 appearance-none"
                                    >
                                        <option value="">GLOBAL_GENERAL_RESERVE</option>
                                        {campaigns.map(c => <option key={c._id} value={c._id}>{c.title.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Sector_ID</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl h-12 px-4 text-[11px] font-bold text-white outline-none focus:border-emerald-500/40 appearance-none"
                                    >
                                        <option value="">UNCATEGORIZED</option>
                                        <option value="Food">FOOD_LOGISTICS</option>
                                        <option value="Education">INTEL_ASSETS</option>
                                        <option value="Medical">BIO_MEDICAL</option>
                                        <option value="Meal">DAILY_RATION</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Protocol Selection */}
                        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Auth_Protocol</p>
                            <div className="grid grid-cols-2 gap-2">
                                {['Zakat', 'Sadqah', 'Fitra', 'General'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setDonationType(type)}
                                        className={`py-2.5 rounded-lg border font-black text-[9px] uppercase tracking-widest transition-all ${
                                            donationType === type 
                                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                                            : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gateway Selection */}
                        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Gateway_Secure</p>
                            <div className="space-y-2">
                                {[
                                    { id: 'Online', icon: CreditCard, label: 'ENCRYPTED_CARD' },
                                    { id: 'Transfer', icon: Banknote, label: 'WIRE_PROTOCOL' },
                                    { id: 'Cash', icon: Wallet, label: 'DIRECT_CASH' }
                                ].map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                                            paymentMethod === method.id 
                                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                                            : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'
                                        }`}
                                    >
                                        <method.icon size={16} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.1em]">{method.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ACTION BUTTON */}
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full group relative h-16 rounded-xl bg-white overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                <span className="text-slate-950 font-black uppercase tracking-widest text-xs group-hover:text-white transition-colors">
                                    {isSubmitting ? "PROCESSING..." : "CONFIRM_TRANSFER"}
                                </span>
                                <ArrowRight size={16} className="text-slate-950 group-hover:text-white transition-colors" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default DonationForm;