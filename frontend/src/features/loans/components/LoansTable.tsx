import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loan } from '../types';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatCurrency, cn } from '@/utils';
import { format } from 'date-fns';
import { Eye, MoreHorizontal, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LoansTableProps {
    loans: Loan[];
}

const ITEMS_PER_PAGE = 10;

export function LoansTable({ loans }: LoansTableProps) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(loans.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, loans.length);
    const currentLoans = loans.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex-1 overflow-hidden border border-slate-200 dark:border-white/10 rounded-sm bg-white dark:bg-slate-900 shadow-sm relative flex flex-col">
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full relative">
                        <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Loan Ref</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Borrower</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Property Details</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Type / Tier</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Term</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Amount</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Status</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {currentLoans.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-slate-500">
                                        No loans found.
                                    </td>
                                </tr>
                            ) : (
                                currentLoans.map((loan) => {
                                    return (
                                        <tr
                                            key={loan.id}
                                            onClick={() => navigate(`/loans/${loan.id}`)}
                                            className="group relative hover:z-20 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-lg"
                                        >
                                            <td className="px-6 py-4 border-r border-slate-300 dark:border-slate-700">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors font-mono">
                                                        {loan.referenceId}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {format(new Date(loan.requestDate), 'MMM d, yyyy')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-r border-slate-300 dark:border-slate-700">
                                                <Tooltip content={
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {loan.borrower.email}</div>
                                                        <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {loan.borrower.phone}</div>
                                                    </div>
                                                }>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-slate-900 dark:text-white hover:text-primary-600 transition-colors">
                                                            {loan.borrower.name}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                            {loan.borrower.kycStatus === 'verified' ? <span className="text-emerald-600">KYC Verified</span> : 'KYC Pending'}
                                                        </span>
                                                    </div>
                                                </Tooltip>
                                            </td>
                                            <td className="px-6 py-4 border-r border-slate-300 dark:border-slate-700">
                                                {loan.collateral ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                                            {loan.collateral.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 font-medium">
                                                            {loan.collateral.propertyType} - {loan.collateral.configuration}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">{loan.type}</span>
                                                    {loan.housingTier && (
                                                        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 rounded-sm mt-1">
                                                            {loan.housingTier}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {loan.financials.termMonths} Mo
                                                    </span>
                                                    <span className="text-[9px] text-slate-500 font-medium mt-0.5">
                                                        {loan.financials.interestRate}% Int
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-black text-slate-900 dark:text-white font-mono">
                                                        {formatCurrency(loan.financials.principalAmount)}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                                                        O/S: {formatCurrency(loan.financials.outstandingBalance, true)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                                <span className={cn(
                                                    'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm inline-block',
                                                    loan.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        loan.status === 'approved' || loan.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                            loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                loan.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                )}>
                                                    {loan.status.replace('-', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center border-slate-300 dark:border-slate-700">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary-600"
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/loans/${loan.id}`); }}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <MoreHorizontal className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {loans.length > 0 && (
                    <div className="border-t border-slate-200 dark:border-white/10 p-3 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                        <div className="text-xs text-slate-500 font-medium">
                            Showing <span className="text-slate-900 dark:text-white font-bold">{startIndex + 1}</span> to <span className="text-slate-900 dark:text-white font-bold">{endIndex}</span> of <span className="text-slate-900 dark:text-white font-bold">{loans.length}</span> loans
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => goToPage(currentPage - 1)}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => goToPage(currentPage + 1)}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
