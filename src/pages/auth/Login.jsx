import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import API from '@/api/axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner"; 
import { Heart, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, Github } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
        }
    }, [navigate]);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().required('Email or Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const res = await API.post('/auth/login', values);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                toast.success("Welcome back!", {
                    description: `Logged in as ${res.data.user.role}`,
                    className: "bg-emerald-500 text-white border-none"
                });

                setTimeout(() => {
                    navigate(res.data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
                }, 800);
            } catch (err) {
                toast.error("Auth Error", {
                    description: err.response?.data?.message || "Check your credentials.",
                });
            }
        },
    });

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-6 bg-[#030712] overflow-hidden font-['Plus_Jakarta_Sans',_sans-serif]">
            
            {/* --- MULTI-LAYERED GRADIENT BACKGROUND --- */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full animate-bounce duration-[10s]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-[450px] z-10">
                <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden">
                    
                    <CardContent className="pt-12 px-10 pb-12">
                        {/* Header Section */}
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl transform group-hover:rotate-12 transition-transform duration-500">
                                    <Sparkles className="text-white size-8" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 tracking-tight">
                                DonationHub
                            </h1>
                            <p className="text-slate-400 text-sm mt-3 font-medium tracking-wide">
                                Enter the realm of giving
                            </p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {/* Input Group: Email */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400 ml-1">
                                    Identity
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        id="email"
                                        {...formik.getFieldProps('email')}
                                        placeholder="Email or Username"
                                        className="h-14 pl-12 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:bg-white/[0.06] focus:border-indigo-500/50 focus:ring-0 transition-all rounded-2xl"
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-rose-500 text-[11px] mt-1 ml-1 font-semibold">{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Input Group: Password */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400">
                                        Secret Key
                                    </label>
                                    <Link to="#" className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors">
                                        FORGOT?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        {...formik.getFieldProps('password')}
                                        placeholder="••••••••"
                                        className="h-14 pl-12 pr-12 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:bg-white/[0.06] focus:border-indigo-500/50 focus:ring-0 transition-all rounded-2xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-rose-500 text-[11px] mt-1 ml-1 font-semibold">{formik.errors.password}</p>
                                )}
                            </div>

                            {/* Neon Action Button */}
                            <Button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full h-14 bg-indigo-600 text-white hover:bg-indigo-500 font-bold text-base rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all duration-300 active:scale-95 disabled:opacity-50 group"
                            >
                                {formik.isSubmitting ? (
                                    <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Enter Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>

                            {/* Separator */}
                            <div className="flex items-center gap-4 py-2">
                                <div className="h-[1px] flex-1 bg-white/10" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Access Tiers</span>
                                <div className="h-[1px] flex-1 bg-white/10" />
                            </div>

                            {/* Quick Access Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        await formik.setValues({ email: 'admin@donationhub.com', password: 'admin123' });
                                        formik.submitForm();
                                    }}
                                    className="flex items-center justify-center gap-3 h-12 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-bold text-slate-300 hover:bg-white/[0.08] hover:border-indigo-500/50 transition-all active:scale-95"
                                >
                                    <ShieldCheck size={16} className="text-indigo-400" /> Admin Node
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        await formik.setValues({ email: 'donor@donationhub.com', password: 'user123' });
                                        formik.submitForm();
                                    }}
                                    className="flex items-center justify-center gap-3 h-12 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-bold text-slate-300 hover:bg-white/[0.08] hover:border-blue-500/50 transition-all active:scale-95"
                                >
                                    <Heart size={16} className="text-blue-400" /> Donor Node
                                </button>
                            </div>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-sm text-slate-500">
                                First time here?{" "}
                                <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors decoration-indigo-400/30 underline underline-offset-8">
                                    Create Identity
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Cyber Security Badges */}
                <div className="mt-8 flex justify-center gap-10">
                    <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
                        <div className="size-8 rounded-full border border-white/20 flex items-center justify-center mb-1">
                            <Github size={14} className="text-white" />
                        </div>
                        <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Open Source</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
                        <div className="size-8 rounded-full border border-white/20 flex items-center justify-center mb-1">
                            <Lock size={14} className="text-white" />
                        </div>
                        <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Quantum Safe</span>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;