import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import API from '@/api/axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            adminCode: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Full name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm your password'),
            adminCode: Yup.string().optional()
        }),
        onSubmit: async (values) => {
            try {
                const { name, email, password, phone, adminCode } = values;
                await API.post('/auth/register', { name, email, password, phone, adminCode });
                
                toast.success("Account Created!", {
                    description: "Your journey starts here. Please sign in.",
                    icon: <CheckCircle2 className="text-emerald-400" />,
                });
                
                setTimeout(() => navigate('/login'), 1500);
            } catch (err) {
                toast.error("Registration Failed", {
                    description: err.response?.data?.message || "Something went wrong. Try again.",
                });
            }
        },
    });

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-6 bg-[#030712] overflow-hidden font-['Plus_Jakarta_Sans',_sans-serif]">
            
            {/* --- ANIMATED GRADIENT BACKGROUND --- */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[0%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[120px] rounded-full animate-bounce duration-[12s]" />
            </div>

            <div className="w-full max-w-[550px] z-10">
                <Card className="border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[2.5rem] overflow-hidden">
                    
                    <CardContent className="pt-10 px-8 md:px-12 pb-12">
                        {/* Header Section */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="relative group mb-4">
                                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl transform group-hover:-rotate-12 transition-transform duration-500">
                                    <Sparkles className="text-white size-7" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 tracking-tight">
                                Create Account
                            </h1>
                            <p className="text-slate-400 text-sm mt-2 font-medium">
                                Join our community of world changers
                            </p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-5">
                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400 ml-1">Full Identity</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <Input
                                        {...formik.getFieldProps('name')}
                                        placeholder="John Doe"
                                        className="h-12 pl-12 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-emerald-500/50 transition-all rounded-xl"
                                    />
                                </div>
                                {formik.touched.name && formik.errors.name && <p className="text-rose-500 text-[10px] font-semibold ml-1">{formik.errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400 ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <Input
                                            {...formik.getFieldProps('email')}
                                            type="email"
                                            placeholder="john@example.com"
                                            className="h-12 pl-12 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-emerald-500/50 transition-all rounded-xl"
                                        />
                                    </div>
                                    {formik.touched.email && formik.errors.email && <p className="text-rose-500 text-[10px] font-semibold ml-1">{formik.errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400 ml-1">Phone</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <Input
                                            {...formik.getFieldProps('phone')}
                                            placeholder="+1 234..."
                                            className="h-12 pl-12 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-emerald-500/50 transition-all rounded-xl"
                                        />
                                    </div>
                                    {formik.touched.phone && formik.errors.phone && <p className="text-rose-500 text-[10px] font-semibold ml-1">{formik.errors.phone}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400 ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <Input
                                            {...formik.getFieldProps('password')}
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-12 pl-12 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-emerald-500/50 transition-all rounded-xl"
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400 ml-1">Confirm</label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <Input
                                            {...formik.getFieldProps('confirmPassword')}
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-12 pl-12 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-emerald-500/50 transition-all rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                            {(formik.touched.password && formik.errors.password) || (formik.touched.confirmPassword && formik.errors.confirmPassword) ? (
                                <p className="text-rose-500 text-[10px] font-semibold ml-1">
                                    {formik.errors.password || formik.errors.confirmPassword}
                                </p>
                            ) : null}

                            {/* Admin Code */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 ml-1 flex justify-between">
                                    Admin Secret Code <span className="text-[9px] lowercase opacity-60">(Optional)</span>
                                </label>
                                <Input
                                    {...formik.getFieldProps('adminCode')}
                                    type="password"
                                    placeholder="Enter only if you are an administrator"
                                    className="h-12 px-4 bg-white/[0.01] border-white/5 text-white placeholder:text-slate-700 focus:bg-white/[0.03] focus:border-white/20 transition-all rounded-xl italic text-sm"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.4)] transition-all duration-300 active:scale-[0.97] disabled:opacity-50 mt-4 group"
                            >
                                {formik.isSubmitting ? (
                                    <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>

                            <div className="pt-4 text-center">
                                <p className="text-sm text-slate-500">
                                    Already part of the mission?{" "}
                                    <Link to="/login" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                                        Sign In Here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default Register;