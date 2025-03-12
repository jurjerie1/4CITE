import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileForm from './ProfileForm';
import UserManagement from './UserManagement';
import HotelManagement from './HotelManagement';
import BookingManagement from './BookingManagement';
import Dashboard from './Dashboard';

interface User {
    _id: number;
    email: string;
    pseudo?: string;
    role: number;
}

interface Booking {
    _id: string;
    hotel: {
        _id: string;
        name: string;
        location: string;
        picture_list?: string[];
    };
    StartDate: string;
    EndDate: string;
    nbPerson: number;
}

interface UserProps {
    user: User;
}

const AdminContent: React.FC<UserProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:3000/api/bookings/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="mb-6 border-b">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'dashboard'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Tableau de bord
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'profile'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Profil
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'users'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Utilisateurs
                    </button>
                    <button
                        onClick={() => setActiveTab('hotels')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'hotels'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Hôtels
                    </button>
                    <button
                        onClick={() => setActiveTab('allBookings')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'allBookings'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Toutes les réservations
                    </button>
                </nav>
            </div>

            {activeTab === 'dashboard' && (
                <Dashboard user={user} bookings={bookings} />
            )}

            {activeTab === 'allBookings' && (
                <BookingManagement onBookingUpdate={() => {
                }} />
            )}

            {activeTab === 'profile' && (
                <ProfileForm user={user} onProfileUpdate={() => {}} />
            )}

            {activeTab === 'users' && (
                <UserManagement onUserUpdate={() => {}} />
            )}

            {activeTab === 'hotels' && (
                <HotelManagement onHotelUpdate={() => {
                }} />
            )}
        </div>
    );
};
export default AdminContent;
