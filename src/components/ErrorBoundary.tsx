import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  sectionName?: string;
  showHomeButton?: boolean;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error internally for diagnostic inspection without exposing to users
    console.error('ErrorBoundary captured error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReturnHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const isSectionLevel = Boolean(this.props.sectionName);
      const title = this.props.fallbackTitle || (isSectionLevel ? `${this.props.sectionName} Temporarily Unavailable` : 'Something went wrong while loading this page.');
      const message = this.props.fallbackMessage || 'We couldn\'t load this information right now. Please try again or contact us directly on WhatsApp.';

      const whatsappUrl = buildWhatsAppUrl(
        'Hello FAVORA, I encountered an issue on the website and would like assistance with my inquiry.',
        BUSINESS_CONFIG.whatsappNumberRaw
      );

      // Section-level lightweight fallback
      if (isSectionLevel) {
        return (
          <div className="w-full py-12 px-4 sm:px-6 flex items-center justify-center">
            <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-[#0D3325] border border-[#16382A] text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-[#16382A] border border-[#B8954A]/30 flex items-center justify-center text-[#B8954A] mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#EDEDED]">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-[#EDEDED]/75 font-sans-clean font-light leading-relaxed">
                  {message}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="btn-tactile inline-flex items-center gap-2 px-4 py-2.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-semibold tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tactile inline-flex items-center gap-2 px-4 py-2.5 bg-[#071F16] hover:bg-[#16382A] text-[#EDEDED] border border-[#16382A] text-xs font-semibold tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        );
      }

      // Full-Page Storefront Root Fallback
      return (
        <div className="min-h-screen bg-[#071F16] text-[#EDEDED] flex flex-col items-center justify-center p-6 selection:bg-[#B8954A]/30">
          <div className="max-w-lg w-full text-center space-y-8 bg-[#0D3325]/90 border border-[#16382A] p-8 sm:p-10 rounded-2xl shadow-2xl backdrop-blur-md">
            
            {/* Brand Logo / Emblem */}
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#071F16] border border-[#B8954A]/50 flex items-center justify-center text-[#B8954A] mx-auto shadow-inner">
                <span className="font-editorial text-2xl font-bold">F</span>
              </div>
              <div className="inline-flex items-center gap-2 pt-2">
                <span className="w-6 h-[1.5px] bg-[#B8954A]" />
                <span className="text-[10px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#B8954A]">
                  FAVORA
                </span>
                <span className="w-6 h-[1.5px] bg-[#B8954A]" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#EDEDED]">
                Something went wrong while loading this page.
              </h1>
              <p className="text-sm text-[#EDEDED]/75 font-sans-clean font-light leading-relaxed max-w-md mx-auto">
                We couldn't load this information right now. Please try reloading, or connect with our team directly on WhatsApp for immediate service.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-bold tracking-[0.16em] uppercase rounded-xl transition-all shadow-lg cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={this.handleReturnHome}
                className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#071F16] hover:bg-[#16382A] text-[#EDEDED] border border-[#16382A] hover:border-[#B8954A]/40 text-xs font-bold tracking-[0.16em] uppercase rounded-xl transition-all cursor-pointer"
              >
                <Home className="w-4 h-4 text-[#B8954A]" />
                <span>Return Home</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold tracking-[0.16em] uppercase rounded-xl transition-all shadow-lg cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="pt-4 border-t border-[#16382A] text-[11px] font-sans-clean text-[#A3B899]">
              Authentic Norwegian Stockfish & Oron Crayfish Provisions
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
