import { Component, ErrorInfo, ReactNode } from 'react';
import { SecurePopup } from './SecurePopup';
import { WifiOff, FileWarning } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Global Error Boundary
 * Catches unhandled exceptions in the component tree and displays 
 * a "Secure Popup" style error message instead of crashing the app.
 */
export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            const isNetworkError = this.state.error?.message.includes('Network') ||
                this.state.error?.message.includes('fetch');

            return (
                <SecurePopup
                    isOpen={true}
                    onClose={() => { }} // Force user to acknowledge via button
                    title={isNetworkError ? "Connection Interrupted" : "Security Exception / Application Error"}
                    severity="critical"
                >
                    <div className="flex flex-col gap-5">
                        <div className="flex items-start gap-4 p-4 bg-red-500/5 border border-red-500/20" style={{ borderRadius: 0 }}>
                            <div className="p-2 bg-red-500/10 border border-red-500/20 shrink-0" style={{ borderRadius: 0 }}>
                                {isNetworkError ? (
                                    <WifiOff className="w-6 h-6 text-red-500" />
                                ) : (
                                    <FileWarning className="w-6 h-6 text-red-500" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-red-400 uppercase tracking-wider text-sm mb-1">
                                    {isNetworkError ? "Secure Channel Lost" : "Runtime Integrity Check Failed"}
                                </h3>
                                <p className="text-sm text-red-200/70 font-medium leading-relaxed">
                                    The system encountered an unexpected state. For security reasons, the current session contexts have been halted.
                                </p>
                            </div>
                        </div>

                        {/* Obfuscated Technical Details (Only show generic message + ID) */}
                        <div className="text-[10px] font-mono text-slate-400 bg-[#050505] p-3 border border-slate-800 flex flex-col gap-1 relative overflow-hidden group" style={{ borderRadius: 0 }}>
                            <div className="absolute top-0 left-0 w-0.5 h-full bg-slate-700" />
                            <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="text-blue-500">Error Ref:</span> {btoa(this.state.error?.message || "Unknown").substring(0, 16)}...
                            </div>
                            <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="text-purple-500">Scope:</span> Global::ReactRender
                            </div>
                        </div>

                        <button
                            onClick={this.handleReset}
                            className="w-full py-4 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-red-900/20 border border-red-500/50 hover:border-red-400"
                            style={{ borderRadius: 0 }}
                        >
                            Reload Secure Session
                        </button>
                    </div>
                </SecurePopup>
            );
        }

        return this.props.children;
    }
}
