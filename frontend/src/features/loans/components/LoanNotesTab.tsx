/**
 * Loan Notes Tab
 * Private/Public notes, threaded comments, mentions, file attachments
 */

import { useState } from 'react';
import { Loan, LoanNote } from '../types';
import { Button } from '@/components/ui/Button';
import { KPICard } from '@/components/ui/KPICard';
import { cn } from '@/utils';
import {
    MessageSquare, Plus, Lock, Globe, Paperclip, Send, Reply, Pin, MoreHorizontal,
    User, Clock, Search, Edit3, Shield, FileText
} from 'lucide-react';
import { LoanNoteCategory } from '../types';

interface LoanNotesTabProps {
    loan: Loan;
}

// Mock notes if not present
const mockNotes: LoanNote[] = [
    {
        id: 'n1',
        content: 'Applicant has strong credit history (785 CIBIL). First-time home buyer. Property is in prime location with good appreciation potential. Recommend approval with standard terms.',
        category: 'underwriter',
        visibility: 'team',
        createdBy: 'Rahul Verma',
        createdByRole: 'Credit Officer',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        pinned: true,
        mentions: ['@Sarah.Jenkins']
    },
    {
        id: 'n2',
        content: 'Salary slip shows ₹3.75L monthly but bank credits average ₹3.5L. Difference may be due to timing of salary credit. Need to verify with HR department.',
        category: 'underwriter',
        visibility: 'team',
        createdBy: 'Rahul Verma',
        createdByRole: 'Credit Officer',
        createdAt: new Date(Date.now() - 14400000).toISOString()
    },
    {
        id: 'n3',
        content: 'Borrower called requesting expedited processing. Property deal needs to close by month-end.',
        category: 'general',
        visibility: 'public',
        createdBy: 'Customer Service',
        createdByRole: 'Support',
        createdAt: new Date(Date.now() - 10800000).toISOString()
    },
    {
        id: 'n4',
        content: 'Verified employment with Google India HR. Employee confirmed in good standing.',
        category: 'compliance',
        visibility: 'private',
        createdBy: 'Compliance Team',
        createdByRole: 'Compliance',
        createdAt: new Date(Date.now() - 3600000).toISOString()
    }
];

const categoryColors: Record<string, string> = {
    underwriter: 'bg-blue-100 text-blue-700 border-blue-200',
    collection: 'bg-amber-100 text-amber-700 border-amber-200',
    compliance: 'bg-purple-100 text-purple-700 border-purple-200',
    general: 'bg-slate-100 text-slate-700 border-slate-200',
    legal: 'bg-red-100 text-red-700 border-red-200',
    internal: 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

const visibilityIcons: Record<string, React.ReactNode> = {
    public: <Globe className="w-3.5 h-3.5" />,
    private: <Lock className="w-3.5 h-3.5" />,
    team: <User className="w-3.5 h-3.5" />,
};

export function LoanNotesTab({ loan }: LoanNotesTabProps) {
    // Local state for notes to simulate functionality
    const [notes, setNotes] = useState<LoanNote[]>(loan.loanNotes || mockNotes);
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [newNote, setNewNote] = useState('');
    const [newNoteCategory, setNewNoteCategory] = useState('general');
    const [newNoteVisibility, setNewNoteVisibility] = useState<'public' | 'private' | 'team'>('team');
    const [showNewNoteForm, setShowNewNoteForm] = useState(false);

    // Filter notes
    const filteredNotes = notes.filter(note => {
        const matchesFilter = filter === 'all' || note.category === filter;
        const matchesSearch = !searchQuery ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Sort: pinned first, then by date
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    };

    const handleSubmitNote = () => {
        if (!newNote.trim()) return;

        const note: LoanNote = {
            id: `n${Date.now()}`,
            content: newNote,
            category: newNoteCategory as LoanNoteCategory,
            visibility: newNoteVisibility,
            createdBy: 'You', // Mock user
            createdByRole: 'Loan Officer',
            createdAt: new Date().toISOString(),
            pinned: false
        };

        setNotes([note, ...notes]);
        setNewNote('');
        setShowNewNoteForm(false);
    };

    const handlePinNote = (noteId: string) => {
        setNotes(notes.map(n =>
            n.id === noteId ? { ...n, pinned: !n.pinned } : n
        ));
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Stats Summary - Redesigned to match Campaigns Page */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
                <KPICard
                    title="Total Notes"
                    value={notes.length}
                    variant="slate"
                    icon={MessageSquare}
                    trend={{ value: `${formatTime(notes[0]?.createdAt || new Date().toISOString())}`, direction: 'neutral', label: 'Latest' }}
                />

                <KPICard
                    title="Underwriter"
                    value={notes.filter(n => n.category === 'underwriter').length}
                    variant="blue"
                    icon={Shield}
                    subtitle="Team inputs"
                />

                <KPICard
                    title="Compliance"
                    value={notes.filter(n => n.category === 'compliance').length}
                    variant="purple"
                    icon={FileText}
                    subtitle="Audited"
                />

                <KPICard
                    title="Pinned"
                    value={notes.filter(n => n.pinned).length}
                    variant="amber"
                    icon={Pin}
                    subtitle="Important"
                />
            </div>

            {/* Header Actions */}
            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-0 border border-slate-200 dark:border-white/10 rounded-none overflow-hidden">
                    {/* Search */}
                    <div className="relative border-r border-slate-200 dark:border-white/10">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-64 bg-white dark:bg-slate-900 text-sm focus:outline-none"
                        />
                    </div>
                    {/* Filter */}
                    <div className="bg-white dark:bg-slate-900">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 bg-transparent text-sm focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Categories</option>
                            <option value="underwriter">Underwriter</option>
                            <option value="collection">Collection</option>
                            <option value="compliance">Compliance</option>
                            <option value="legal">Legal</option>
                            <option value="general">General</option>
                        </select>
                    </div>
                </div>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowNewNoteForm(true)} className="rounded-none">
                    Add Note
                </Button>
            </div>

            {/* New Note Form */}
            {showNewNoteForm && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 shadow-2xl relative animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">New Note</h3>
                        <button onClick={() => setShowNewNoteForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            ×
                        </button>
                    </div>
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write your note here... Use @mention to tag team members"
                        autoFocus
                        className="w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-4 text-sm focus:outline-none focus:border-primary-500 resize-none font-medium"
                    />
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            {/* Category */}
                            <select
                                value={newNoteCategory}
                                onChange={(e) => setNewNoteCategory(e.target.value)}
                                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider rounded-none"
                            >
                                <option value="general">General</option>
                                <option value="underwriter">Underwriter</option>
                                <option value="collection">Collection</option>
                                <option value="compliance">Compliance</option>
                                <option value="legal">Legal</option>
                            </select>
                            {/* Visibility */}
                            <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-none overflow-hidden">
                                <button
                                    onClick={() => setNewNoteVisibility('public')}
                                    className={cn(
                                        "px-3 py-1.5 text-xs flex items-center gap-1.5 font-bold uppercase",
                                        newNoteVisibility === 'public' ? 'bg-slate-900 text-white dark:bg-slate-700' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900'
                                    )}
                                >
                                    <Globe className="w-3 h-3" /> Public
                                </button>
                                <button
                                    onClick={() => setNewNoteVisibility('team')}
                                    className={cn(
                                        "px-3 py-1.5 text-xs flex items-center gap-1.5 border-l border-r border-slate-200 dark:border-white/10 font-bold uppercase",
                                        newNoteVisibility === 'team' ? 'bg-slate-900 text-white dark:bg-slate-700' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900'
                                    )}
                                >
                                    <User className="w-3 h-3" /> Team
                                </button>
                                <button
                                    onClick={() => setNewNoteVisibility('private')}
                                    className={cn(
                                        "px-3 py-1.5 text-xs flex items-center gap-1.5 font-bold uppercase",
                                        newNoteVisibility === 'private' ? 'bg-slate-900 text-white dark:bg-slate-700' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900'
                                    )}
                                >
                                    <Lock className="w-3 h-3" /> Private
                                </button>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            disabled={!newNote.trim()}
                            onClick={handleSubmitNote}
                            leftIcon={<Send className="w-3.5 h-3.5" />}
                            className="rounded-none shadow-lg shadow-primary-500/20"
                        >
                            Post Note
                        </Button>
                    </div>
                </div>
            )}

            {/* Notes List */}
            <div className="space-y-4">
                {sortedNotes.map((note) => (
                    <div
                        key={note.id}
                        className={cn(
                            "bg-white dark:bg-slate-900 border transition-all duration-200 group hover:shadow-lg",
                            note.pinned
                                ? "border-amber-400 dark:border-amber-500/50 shadow-amber-500/10"
                                : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                        )}
                    >
                        {/* Note Header - Sharp & styled */}
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 flex items-center justify-center text-sm font-black text-white rounded-none shadow-md",
                                    note.createdBy === 'You' ? 'bg-indigo-600' : 'bg-slate-700'
                                )}>
                                    {note.createdBy.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{note.createdBy}</span>
                                        {note.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="font-bold text-slate-500 uppercase tracking-wider">{note.createdByRole}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            <span>{formatTime(note.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={cn(
                                    "px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border",
                                    categoryColors[note.category] || categoryColors.general
                                )}>
                                    {note.category}
                                </span>
                                <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                                    {visibilityIcons[note.visibility]}
                                    {note.visibility}
                                </span>
                                <button className="p-1.5 text-slate-400 hover:text-slate-900 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Note Content */}
                        <div className="px-6 py-5">
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-7 whitespace-pre-wrap font-medium">
                                {note.content.split(/(@\w+\.\w+)/g).map((part, i) =>
                                    part.startsWith('@') ? (
                                        <span key={i} className="text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-900/30 px-1 rounded-sm">{part}</span>
                                    ) : part
                                )}
                            </p>

                            {/* Attachments */}
                            {note.attachments && note.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                    {note.attachments.map((file) => (
                                        <a
                                            key={file.id}
                                            href={file.url}
                                            className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-600 hover:border-primary-200 transition-all group/file"
                                        >
                                            <Paperclip className="w-3.5 h-3.5 group-hover/file:text-primary-500" />
                                            <span>{file.name}</span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Note Actions - Functional */}
                        <div className="px-6 py-3 bg-slate-50/80 dark:bg-slate-900/30 border-t border-slate-100 dark:border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 transition-colors">
                                    <Reply className="w-3.5 h-3.5" /> Reply
                                </button>
                                <button
                                    onClick={() => handlePinNote(note.id)}
                                    className={cn(
                                        "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
                                        note.pinned ? "text-amber-600 hover:text-amber-700" : "text-slate-400 hover:text-amber-600"
                                    )}
                                >
                                    <Pin className="w-3.5 h-3.5" /> {note.pinned ? 'Unpin' : 'Pin'}
                                </button>
                            </div>
                            <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors">
                                <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {sortedNotes.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 border-dashed">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No notes found</h3>
                    <p className="text-sm text-slate-500 mb-6">Start a conversation or add a record to this loan</p>
                    <Button variant="primary" onClick={() => setShowNewNoteForm(true)} className="shadow-lg shadow-primary-500/20">
                        Add First Note
                    </Button>
                </div>
            )}
        </div>
    );
}
