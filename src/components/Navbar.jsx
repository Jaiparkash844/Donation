import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
    LayoutDashboard, 
    Globe, 
    Heart, 
    ShieldAlert, 
    Settings, 
    LogOut,
    Zap
} from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/50 font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    
                    {/* --- LOGO --- */}
                    <div className="flex items-center gap-10">
                        <Link to="/dashboard" className="flex items-center gap-3 group">
                            <div className="size-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all group-hover:scale-110">
                                <Zap size={20} className="text-slate-950 fill-current" />
                            </div>
                            <span className="text-lg font-black tracking-tighter text-white uppercase italic">
                                DONATION<span className="text-emerald-500">HUB</span>
                            </span>
                        </Link>

                        {/* --- MAIN NAVIGATION --- */}
                        <div className="hidden md:flex items-center gap-2">
                            {[
                                { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                                { path: '/campaigns', label: 'Missions', icon: Globe },
                                { path: '/donate', label: 'Allocate', icon: Heart },
                            ].map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-4 py-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group ${
                                        isActive(link.path) ? 'text-emerald-400' : 'text-slate-500 hover:text-white'
                                    }`}
                                >
                                    <link.icon size={14} />
                                    {link.label}
                                    {isActive(link.path) && (
                                        <div className="absolute bottom-[-18px] left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                    )}
                                </Link>
                            ))}

                            {/* --- ADMIN DIVIDER & LINKS --- */}
                            {isAdmin && (
                                <>
                                    <div className="h-4 w-[1px] bg-slate-800 mx-4" />
                                    <Link
                                        to="/admin/dashboard"
                                        className={`px-4 py-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                            isActive('/admin/dashboard') ? 'text-cyan-400' : 'text-slate-500 hover:text-cyan-400'
                                        }`}
                                    >
                                        <ShieldAlert size={14} />
                                        Admin_Console
                                    </Link>
                                    <Link
                                        to="/admin/campaigns"
                                        className={`px-4 py-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                            isActive('/admin/campaigns') ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
                                        }`}
                                    >
                                        <Settings size={14} />
                                        Operations
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* --- USER ACTIONS --- */}
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end border-r border-slate-800 pr-6">
                            <div className="flex items-center gap-2">
                                <div className={`size-1.5 rounded-full ${isAdmin ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                                    {isAdmin ? 'System_Admin' : 'Active_Donator'}
                                </span>
                            </div>
                            <span className="text-xs font-black text-white uppercase italic tracking-tighter">
                                {user?.name || 'Unknown_Node'}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:text-rose-400 transition-all group"
                        >
                            <span className="hidden sm:inline">Logout</span>
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
