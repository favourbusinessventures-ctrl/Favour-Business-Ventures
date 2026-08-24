import React, { useState } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowLeft, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onReturnToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onReturnToStore }) => {
  const { signIn, loading, error, clearError } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch {
      // Error handled in context state
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#071F16] text-[#F5F0E6] p-4 sm:p-6 selection:bg-[#B8954A]/30">
      
      {/* Top back action */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button
          onClick={onReturnToStore}
          className="inline-flex items-center gap-2 text-xs font-sans-clean font-semibold tracking-wider text-[#A3B899] hover:text-[#B8954A] transition-colors py-2 px-3 rounded-[2px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Customer Store
        </button>

        <div className="flex items-center gap-1.5 text-[11px] font-sans-clean text-[#6B7266]">
          <Shield className="w-3.5 h-3.5 text-[#B8954A]" />
          <span>Restricted Portal</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0D3325] border border-[#16382A] shadow-2xl p-8 sm:p-10 relative rounded-[2px]">
        
        {/* Subtle Brass Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B8954A] to-transparent" />

        {/* Branding & Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[2px] bg-[#071F16] border border-[#B8954A]/40 text-[#B8954A] mb-1">
            <Shield className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#B8954A]">
              FAVORA
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F0E6]">
              Admin Portal
            </h1>
          </div>

          <p className="text-xs text-[#A3B899] font-sans-clean font-light">
            Authorized administrative access only.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-950/60 border border-red-800/60 text-red-200 text-xs font-sans-clean rounded-[2px] flex items-start gap-2.5">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
            <button 
              type="button" 
              onClick={clearError}
              className="text-red-400 hover:text-red-200 text-xs ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#A3B899]">
              Administrator Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7266]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@favourbusinessventures.com"
                className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] focus:outline-none text-sm text-[#F5F0E6] pl-10 pr-4 py-3 rounded-[2px] transition-colors placeholder:text-[#6B7266]/60 font-sans-clean"
                disabled={submitting || loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#A3B899]">
              Secure Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7266]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] focus:outline-none text-sm text-[#F5F0E6] pl-10 pr-11 py-3 rounded-[2px] transition-colors placeholder:text-[#6B7266]/60 font-sans-clean"
                disabled={submitting || loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B7266] hover:text-[#A3B899] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full mt-2 bg-[#B8954A] hover:bg-[#C9A55B] text-[#071F16] font-sans-clean font-semibold text-xs tracking-[0.25em] uppercase py-3.5 px-6 rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting || loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Access...</span>
              </>
            ) : (
              <span>Sign In to Admin</span>
            )}
          </button>
        </form>

        {/* Security Notice Footer */}
        <div className="mt-8 pt-6 border-t border-[#16382A] text-center">
          <p className="text-[10px] text-[#6B7266] font-sans-clean leading-relaxed">
            Protected administrative environment. All authentication attempts are logged for security.
          </p>
        </div>

      </div>

    </div>
  );
};
