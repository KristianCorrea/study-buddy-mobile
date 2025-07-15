// lib/utils.ts
export const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 120) return '1 hour ago';
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    if (diffInMinutes < 2880) return '1 day ago';
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
};

export const formatDate = (dateString: string) => {
return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string) => {
return new Date(dateString).toLocaleString();
};