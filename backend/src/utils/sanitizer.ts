/**
 * Sanitization Utility
 * Helpers for cleaning input data to prevent XSS and other injection attacks
 */

/**
 * Basic HTML/Script tag removal for strings
 */
export function sanitizeString(val: string): string {
    if (typeof val !== 'string') return val;

    // Remove script tags and their content
    let cleaned = val.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '');

    // Remove on* event handlers
    cleaned = cleaned.replace(/\s+on\w+="[^"]*"/gim, '');
    cleaned = cleaned.replace(/\s+on\w+='[^']*'/gim, '');

    // Remove javascript: pseudo-protocol
    cleaned = cleaned.replace(/javascript:/gim, '');

    // Basic tag removal (if needed, or just let them stay as escaped text)
    // For now, let's just escape dangerous characters if they look like tags
    // cleaned = cleaned.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return cleaned.trim();
}

/**
 * Recursively sanitize an object or array
 */
export function sanitizeData(data: any): any {
    if (data === null || data === undefined) {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(item => sanitizeData(item));
    }

    if (typeof data === 'object') {
        const sanitized: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                sanitized[key] = sanitizeData(data[key]);
            }
        }
        return sanitized;
    }

    if (typeof data === 'string') {
        return sanitizeString(data);
    }

    return data;
}
