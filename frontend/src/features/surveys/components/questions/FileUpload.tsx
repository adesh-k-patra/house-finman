import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';

interface FileUploadProps {
    label?: string;
    description?: string;
    required?: boolean;
    maxSizeMB?: number; // Default 5MB
    acceptedTypes?: string[]; // e.g., ['.pdf', '.jpg', '.png']
    allowMultiple?: boolean;
    onChange?: (files: File[]) => void;
    className?: string;
    disabled?: boolean;
}

export function FileUpload({
    label,
    description,
    required,
    maxSizeMB = 5,
    acceptedTypes = ['.pdf', '.jpg', '.png', '.doc', '.docx'],
    allowMultiple = false,
    onChange,
    className,
    disabled = false
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): string | null => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            return `File larger than ${maxSizeMB}MB`;
        }
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (acceptedTypes.length > 0 && !acceptedTypes.includes(extension)) {
            return `Invalid file type. Accepted: ${acceptedTypes.join(', ')}`;
        }
        return null;
    };

    const handleFiles = (newFiles: File[]) => {
        setError(null);
        const validFiles: File[] = [];
        let hasError = false;

        newFiles.forEach(file => {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                hasError = true;
            } else {
                validFiles.push(file);
            }
        });

        if (hasError && validFiles.length === 0) return;

        const updatedFiles = allowMultiple ? [...files, ...validFiles] : validFiles;
        setFiles(updatedFiles);
        onChange?.(updatedFiles);
    };

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(Array.from(e.dataTransfer.files));
    }, [files, allowMultiple]); // Dependencies for state update

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onChange?.(newFiles);
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Label Section */}
            {(label || description) && (
                <div className="space-y-1">
                    {label && (
                        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            {label}
                            {required && <span className="text-red-500">*</span>}
                        </label>
                    )}
                    {description && (
                        <p className="text-xs text-slate-500">{description}</p>
                    )}
                </div>
            )}

            {/* Drop Zone */}
            <div
                onDragOver={!disabled ? onDragOver : undefined}
                onDragLeave={!disabled ? onDragLeave : undefined}
                onDrop={!disabled ? onDrop : undefined}
                className={cn(
                    "relative border border-dashed p-8 transition-all text-center",
                    "bg-slate-50 dark:bg-slate-900/50",
                    isDragging
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600",
                    error ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/10" : "",
                    disabled ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900/80 hover:border-slate-300 pointer-events-none" : ""
                )}
            >
                <input
                    type="file"
                    className={cn("absolute inset-0 w-full h-full opacity-0", disabled ? "cursor-not-allowed" : "cursor-pointer")}
                    onChange={handleFileInput}
                    multiple={allowMultiple}
                    accept={acceptedTypes.join(',')}
                    disabled={disabled}
                />

                <div className="flex flex-col items-center gap-3 pointer-events-none">
                    <div className={cn(
                        "p-3 rounded-none bg-white dark:bg-slate-800 border shadow-sm",
                        isDragging ? "border-blue-200 text-blue-600" : "border-slate-200 text-slate-400"
                    )}>
                        <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-slate-400">
                            {acceptedTypes.join(', ').replace(/\./g, '').toUpperCase()} (Max {maxSizeMB}MB)
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 p-2 border-l-2 border-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                </div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in group">
                            <div className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 border border-blue-100 dark:border-blue-800 shrink-0">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                onClick={() => removeFile(idx)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <div className="flex justify-end pt-1">
                        <span className="text-xs text-slate-400">
                            {files.length} file{files.length !== 1 ? 's' : ''} selected
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
