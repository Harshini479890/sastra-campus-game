import React, { useState, useMemo, useEffect } from 'react';
import { X, Calendar, Users, Trophy, BookOpen, Bell, CheckCircle, AlertTriangle } from 'lucide-react';

// --- Type Definitions ---
interface User {
    id: string;
    name: string;
    type: 'student' | 'club_rep';
    clubName?: string;
}

export interface Notification {
    id: number;
    type: 'event' | 'club' | 'achievement' | 'material' | 'broadcast';
    title: string;
    description: string;
    time: string;
    club: string;
    icon: React.ElementType;
    color: string;
    iconColor: string;
}

// Initial set of mock notifications
const initialNotifications: Notification[] = [
    {
        id: 1,
        type: 'event',
        title: 'Annual Coding Competition Tomorrow!',
        description: 'Join the competitive coding event at 10 AM in the Computer Lab (Room 301).',
        time: '2 hours ago',
        club: 'Coding Club',
        icon: Trophy,
        color: 'from-yellow-100 to-orange-100',
        iconColor: 'text-yellow-600'
    },
    {
        id: 2,
        type: 'club',
        title: 'Photography Workshop Signup',
        description: 'Learn advanced photography techniques this weekend. Limited seats available!',
        time: '1 day ago',
        club: 'Photography Club',
        icon: Users,
        color: 'from-purple-100 to-pink-100',
        iconColor: 'text-purple-600'
    },
    {
        id: 3,
        type: 'achievement',
        title: 'New Badge Earned!',
        description: 'You earned the "Quick Learner" badge for completing 5 quizzes successfully.',
        time: '2 days ago',
        club: 'System',
        icon: Trophy,
        color: 'from-green-100 to-blue-100',
        iconColor: 'text-green-600'
    },
    {
        id: 4,
        type: 'material',
        title: 'New Study Material Available',
        description: 'Advanced Mathematics notes uploaded by Prof. Kumar for Calculus II.',
        time: '3 days ago',
        club: 'Mathematics Dept.',
        icon: BookOpen,
        color: 'from-blue-100 to-indigo-100',
        iconColor: 'text-blue-600'
    },
    {
        id: 5,
        type: 'event',
        title: 'Career Fair Registration Open',
        description: 'Don\'t miss the chance to meet top employers. Register by Friday!',
        time: '4 days ago',
        club: 'Career Services',
        icon: Calendar,
        color: 'from-red-100 to-orange-100',
        iconColor: 'text-red-600'
    }
];

// --- Component: NotificationItem ---
interface NotificationItemProps {
    notification: Notification;
    onDismiss: (id: number, title: string) => void;
    onJoin: (id: number, title: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss, onJoin }) => {
    const IconComponent = notification.icon;

    return (
        <div
            key={notification.id}
            className={`bg-gradient-to-r ${notification.color} rounded-xl p-4 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] cursor-default shadow-md`}
        >
            <div className="flex items-start space-x-4">
                <div className={`p-2 bg-white rounded-lg ${notification.iconColor} shadow-inner flex-shrink-0`}>
                    <IconComponent size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                        <h4 className="font-bold text-gray-800 text-lg truncate">{notification.title}</h4>
                        <span className="text-xs text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">{notification.time}</span>
                    </div>
                    <p className="text-gray-600 mb-3 text-sm">{notification.description}</p>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-white rounded-full border border-gray-200">{notification.club}</span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => onDismiss(notification.id, notification.title)}
                                className="bg-white hover:bg-gray-100 text-gray-700 px-3 py-1 text-sm transition-colors duration-200 rounded-md shadow-sm border border-gray-300 font-semibold"
                            >
                                Dismiss
                            </button>
                            {notification.type === 'event' && (
                                <button
                                    onClick={() => onJoin(notification.id, notification.title)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm transition-colors duration-200 rounded-md shadow-lg font-semibold"
                                >
                                    Join Event
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Component: NotificationsPanel ---
interface NotificationsPanelProps {
    user: User;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    onClose: () => void;
    eventToPost?: { title: string; description: string } | null; // New prop for events
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ user, notifications, setNotifications, onClose, eventToPost }) => {
    const [statusMessage, setStatusMessage] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
    const [activeTab, setActiveTab] = useState<'all' | 'event' | 'club' | 'achievement' | 'material'>('all');

    // Effect to add new event to notifications list
    useEffect(() => {
        if (eventToPost && user.type === 'club_rep' && user.clubName) {
            const newId = Date.now();
            const newEventNotification: Notification = {
                id: newId,
                type: 'event',
                title: eventToPost.title,
                description: eventToPost.description,
                time: 'Just now',
                club: user.clubName,
                icon: Calendar,
                color: 'from-green-100 to-blue-100',
                iconColor: 'text-green-600',
            };

            setNotifications(prev => [newEventNotification, ...prev]);
            setStatusMessage({ message: 'Event successfully posted!', type: 'success' });
        }
    }, [eventToPost, user, setNotifications]);

    // Automatically clear status message after a few seconds
    useEffect(() => {
        if (statusMessage.type) {
            const timer = setTimeout(() => {
                setStatusMessage({ message: '', type: null });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [statusMessage]);

    const filterTabs = [
        { label: 'All', filter: 'all' },
        { label: 'Events', filter: 'event' },
        { label: 'Clubs & Updates', filter: 'club' },
        { label: 'Achievements', filter: 'achievement' },
        { label: 'Materials', filter: 'material' },
    ];

    // Filtering Logic
    const filteredNotifications = useMemo(() => {
        if (activeTab === 'all') {
            return notifications;
        }
        const filterType = activeTab === 'club' ? ['club', 'broadcast'] : [activeTab];
        return notifications.filter(n => filterType.includes(n.type));
    }, [activeTab, notifications]);

    // Action Handlers
    const handleDismiss = (id: number, title: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setStatusMessage({ message: `Notification "${title}" dismissed.`, type: 'success' });
    };

    const handleJoin = (id: number, title: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setStatusMessage({ message: `Successfully joined event: "${title}"!`, type: 'success' });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-['Inter'] backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all duration-300">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
                            <Bell size={28} className="text-indigo-600 animate-pulse" />
                            <span>Campus Feed</span>
                        </h3>
                        <button
                            onClick={onClose}
                            aria-label="Close Notifications"
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Status Message */}
                {statusMessage.type && (
                    <div className={`p-3 text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} flex items-center justify-center space-x-2 transition-all duration-300`}>
                        {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                        <span>{statusMessage.message}</span>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="px-6 py-4 flex-shrink-0 border-b border-gray-100">
                    <div className="flex flex-wrap gap-2">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.filter}
                                onClick={() => setActiveTab(tab.filter as any)}
                                className={`
                                    px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300
                                    ${activeTab === tab.filter
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300/50 scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications List (Scrollable Area) */}
                <div className="overflow-y-auto p-6 space-y-4 flex-1 custom-scrollbar">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onDismiss={handleDismiss}
                                onJoin={handleJoin}
                            />
                        ))
                    ) : (
                        <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <Bell size={32} className="text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No {activeTab === 'all' ? '' : filterTabs.find(t => t.filter === activeTab)?.label} notifications found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPanel;