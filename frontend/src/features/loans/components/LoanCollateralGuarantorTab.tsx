/**
 * Loan Collateral & Guarantors Tab
 * Multiple collaterals, valuation history, guarantor details with credit info
 */

import { Loan, Collateral, Guarantor } from '../types';
import { Button } from '@/components/ui/Button';
import { KPICard } from '@/components/ui/KPICard';
import { cn, formatCurrency } from '@/utils';
import {
    Building2, MapPin, Shield, User, Phone, Mail,
    TrendingUp, AlertTriangle, CheckCircle2, Clock,
    FileText, Plus, Edit3, Car, Home, Package, Landmark, AlertCircle
} from 'lucide-react';

interface LoanCollateralGuarantorTabProps {
    loan: Loan;
}

const getCollateralIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case 'apartment':
        case 'house':
        case 'flat':
            return <Home className="w-6 h-6" />;
        case 'vehicle':
        case 'car':
            return <Car className="w-6 h-6" />;
        case 'land':
        case 'plot':
            return <Landmark className="w-6 h-6" />;
        default:
            return <Package className="w-6 h-6" />;
    }
};



export function LoanCollateralGuarantorTab({ loan }: LoanCollateralGuarantorTabProps) {
    // Get all collaterals (single or multiple)
    const collaterals: Collateral[] = loan.collaterals || [loan.collateral].filter(c => c && c.type !== 'Unsecured');
    const guarantors: Guarantor[] = loan.guarantors || [];

    const isUnsecured = loan.collateral?.type === 'Unsecured';

    // Calculate summary metrics
    const totalValue = collaterals.reduce((sum, c) => sum + (c?.value || 0), 0);
    const avgLTV = collaterals.length > 0
        ? Math.round(collaterals.reduce((sum, c) => sum + (c?.ltvRatio || 0), 0) / collaterals.length)
        : 0;
    const verifiedCount = collaterals.filter(c => c?.isVerified).length;

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Stats Summary - Redesigned with Premium KPICards */}
            {!isUnsecured && collaterals.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-white/10 mb-6 px-0.5">
                    <KPICard
                        title="Total Asset Value"
                        value={formatCurrency(totalValue, true)}
                        variant="indigo"
                        icon={Building2}
                        subtitle="Combined market value"
                        compact
                    />
                    <KPICard
                        title="Avg LTV Ratio"
                        value={`${avgLTV}%`}
                        variant={avgLTV <= 70 ? "emerald" : avgLTV <= 80 ? "amber" : "red"}
                        icon={TrendingUp}
                        subtitle="Loan to Value"
                        compact
                    />
                    <KPICard
                        title="Assets Pledged"
                        value={collaterals.length}
                        variant="slate"
                        icon={Package}
                        subtitle="Secured items"
                        compact
                    />
                    <KPICard
                        title="Verification Status"
                        value={`${verifiedCount}/${collaterals.length}`}
                        variant="teal"
                        icon={CheckCircle2}
                        subtitle="Verified assets"
                        compact
                    />
                </div>
            )}

            {/* Collaterals Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-500" /> Collateral Details
                    </h3>
                    {!isUnsecured && (
                        <span className="text-xs font-bold text-white bg-indigo-600 px-3 py-1 uppercase tracking-wider">
                            {collaterals.length} Asset{collaterals.length !== 1 ? 's' : ''} Record
                        </span>
                    )}
                </div>

                {isUnsecured ? (
                    <div className="p-10 border border-slate-200 dark:border-white/10 border-dashed bg-slate-50/50 dark:bg-white/[0.02] text-center">
                        <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Unsecured Loan</h4>
                        <p className="text-sm text-slate-500">This is an unsecured loan with no collateral pledged</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {collaterals.map((collateral, index) => (
                            <div key={collateral.id || index} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 transition-all duration-300 shadow-sm hover:shadow-xl">
                                {/* Header */}
                                <div className="px-6 py-4 bg-black/90 backdrop-blur-sm border-b border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-inner rounded-sm">
                                            {getCollateralIcon(collateral.type)}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white">{collateral.name || collateral.type}</h4>
                                            <p className="text-xs font-bold text-white/60 uppercase tracking-wider">{collateral.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="px-3 py-1 bg-white/10 text-white text-lg font-black tracking-tight inline-block mb-1 border border-white/20">
                                            {formatCurrency(collateral.value)}
                                        </div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Market Value</p>
                                    </div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-white/5">
                                    {/* Column 1: Core Details */}
                                    <div className="p-6 space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Asset Type</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{collateral.propertyType || collateral.type}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Configuration</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{collateral.configuration || '—'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Location</p>
                                            {collateral.address ? (
                                                <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                                                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                                    {collateral.address}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">No address provided</span>
                                            )}
                                        </div>

                                        {(collateral.registrationNumber || collateral.chassisNumber) && (
                                            <div className="pt-2">
                                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Vehicle Info</p>
                                                <div className="space-y-1.5">
                                                    {collateral.registrationNumber && (
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-slate-500">Reg No:</span>
                                                            <span className="font-mono font-bold text-slate-900 dark:text-white">{collateral.registrationNumber}</span>
                                                        </div>
                                                    )}
                                                    {collateral.chassisNumber && (
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-slate-500">Chassis:</span>
                                                            <span className="font-mono font-bold text-slate-900 dark:text-white">{collateral.chassisNumber}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Column 2: Status & Risks */}
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">Verification Status</p>
                                            <div className="flex gap-2">
                                                {collateral.isVerified ? (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider w-full justify-center">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider w-full justify-center">
                                                        <Clock className="w-3.5 h-3.5" /> Pending
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Legal Status</p>
                                                {collateral.legalStatus === 'clear' ? (
                                                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Clear</span>
                                                ) : (
                                                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {collateral.legalStatus || 'Check'}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Insurance</p>
                                                {collateral.insuranceStatus === 'active' ? (
                                                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Shield className="w-3 h-3" /> Active</span>
                                                ) : (
                                                    <span className="text-xs font-bold text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {collateral.insuranceStatus || 'None'}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">LTV Health</p>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 overflow-hidden">
                                                <div
                                                    className={cn("h-full", collateral.ltvRatio <= 70 ? "bg-emerald-500" : collateral.ltvRatio <= 80 ? "bg-amber-500" : "bg-red-500")}
                                                    style={{ width: `${Math.min(collateral.ltvRatio, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-[10px] font-bold text-slate-400">0%</span>
                                                <span className={cn("text-xs font-bold", collateral.ltvRatio <= 70 ? "text-emerald-600" : "text-amber-600")}>{collateral.ltvRatio}%</span>
                                                <span className="text-[10px] font-bold text-slate-400">100%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3: Valuation & Actions */}
                                    <div className="p-0 flex flex-col h-full">
                                        <div className="p-6 flex-1">
                                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">Latest Valuation</p>
                                            {collateral.valuationHistory && collateral.valuationHistory.length > 0 ? (
                                                <div className="space-y-3">
                                                    {collateral.valuationHistory.slice(0, 2).map((val, i) => (
                                                        <div key={i} className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                                                            <div>
                                                                <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(val.amount)}</p>
                                                                <p className="text-slate-400">{new Date(val.valuationDate).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="capitalize text-slate-600 dark:text-slate-400">{val.valuationType.replace('_', ' ')}</p>
                                                                <p className="text-[10px] text-slate-400">{val.valuedBy}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-400 italic">No history available</p>
                                            )}
                                        </div>

                                        <div className="p-4 bg-slate-50 dark:bg-slate-950/30 flex flex-col gap-2 mt-auto border-t border-slate-100 dark:border-white/5">
                                            <Button variant="ghost" size="sm" className="w-full justify-start text-xs uppercase tracking-wider font-bold" leftIcon={<FileText className="w-3.5 h-3.5" />}>
                                                View Documents
                                            </Button>
                                            <Button variant="ghost" size="sm" className="w-full justify-start text-xs uppercase tracking-wider font-bold" leftIcon={<TrendingUp className="w-3.5 h-3.5" />}>
                                                Request Revaluation
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Guarantors Section - Redesigned */}
            <div>
                <div className="flex items-center justify-between mb-4 mt-8">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-500" /> Guarantors
                    </h3>
                    <Button variant="outline" size="sm" className="rounded-none border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" leftIcon={<Plus className="w-4 h-4" />}>
                        Add Guarantor
                    </Button>
                </div>

                {guarantors.length === 0 ? (
                    <div className="p-10 border border-slate-200 dark:border-white/10 border-dashed bg-slate-50/50 dark:bg-white/[0.02] text-center">
                        <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Guarantors</h4>
                        <p className="text-sm text-slate-500">No guarantors have been linked to this loan application</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {guarantors.map((guarantor) => (
                            <div key={guarantor.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-lg p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
                                            {guarantor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900 dark:text-white">{guarantor.name}</h4>
                                            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">{guarantor.relationship}</p>
                                        </div>
                                    </div>
                                    {guarantor.kycStatus === 'verified' ? (
                                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                                            Pending
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Contact</p>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                                            <Phone className="w-3 h-3 text-indigo-400" /> {guarantor.phone}
                                        </div>
                                        {guarantor.email && (
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                                                <Mail className="w-3 h-3 text-indigo-400" /> {guarantor.email}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Guarantee</p>
                                        <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(guarantor.guaranteeAmount)}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs uppercase font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                                        View Profile
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-slate-50 dark:bg-slate-800 hover:text-indigo-600">
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
