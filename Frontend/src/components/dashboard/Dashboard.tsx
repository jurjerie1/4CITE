import React from 'react';

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

interface DashboardProps {
    user: User;
    bookings: Booking[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, bookings }) => {
    const formatDateFr = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return date.toLocaleDateString('fr-FR', options);
    };

    const renderBookings = () => {
        const now = new Date();
        const pastBookings = bookings.filter(booking => new Date(booking.EndDate) < now);
        const ongoingBookings = bookings.filter(booking => new Date(booking.StartDate) <= now && new Date(booking.EndDate) >= now);
        const upcomingBookings = bookings.filter(booking => new Date(booking.StartDate) > now);

        return (
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Réservations en cours</h3>
                    {ongoingBookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {ongoingBookings.map(booking => (
                                <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-md transition-shadow">
                                    {booking.hotel.picture_list && booking.hotel.picture_list.length > 0 ? (
                                        <img
                                            src={`http://localhost:3000${booking.hotel.picture_list[0]}`}
                                            alt={`${booking.hotel.name} - Image`}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">Aucune image</span>
                                        </div>
                                    )}
                                    <h4 className="font-bold pl-4 text-lg text-blue-600 mb-1">{booking.hotel.name}</h4>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <p className="h-4 w-4 mr-1">📍</p>
                                        <span>{booking.hotel.location}</span>
                                    </div>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        <span>Arrivée: {formatDateFr(booking.StartDate)}</span>
                                    </div>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        <span>Départ: {formatDateFr(booking.EndDate)}</span>
                                    </div>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 lucide lucide-user w-4 mr-1"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                                             strokeLinejoin="round">
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        <span>Nombre de personnes: {booking.nbPerson}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Aucune réservation en cours.</p>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Réservations à venir</h3>
                    {upcomingBookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {upcomingBookings.map(booking => (
                                <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-md transition-shadow">
                                    {booking.hotel.picture_list && booking.hotel.picture_list.length > 0 ? (
                                        <img
                                            src={`http://localhost:3000${booking.hotel.picture_list[0]}`}
                                            alt={`${booking.hotel.name} - Image`}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">Aucune image</span>
                                        </div>
                                    )}
                                    <h4 className="font-bold pl-4 text-lg text-blue-600 mb-1">{booking.hotel.name}</h4>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <p className="h-4 w-4 mr-1">📍</p>
                                        <span>{booking.hotel.location}</span>
                                    </div>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        <span>Arrivée: {formatDateFr(booking.StartDate)}</span>
                                    </div>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        <span>Départ: {formatDateFr(booking.EndDate)}</span>
                                    </div>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 lucide lucide-user w-4 mr-1"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                                             strokeLinejoin="round">
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        <span>Nombre de personnes: {booking.nbPerson}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Aucune réservation à venir.</p>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Réservations passées</h3>
                    {pastBookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pastBookings.map(booking => (
                                <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-md transition-shadow">
                                    {booking.hotel.picture_list && booking.hotel.picture_list.length > 0 ? (
                                        <img
                                            src={`http://localhost:3000${booking.hotel.picture_list[0]}`}
                                            alt={`${booking.hotel.name} - Image`}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">Aucune image</span>
                                        </div>
                                    )}
                                    <h4 className="font-bold pl-4 text-lg text-blue-600 mb-1">{booking.hotel.name}</h4>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <p className="h-4 w-4 mr-1">📍</p>
                                        <span>{booking.hotel.location}</span>
                                    </div>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        <span>Arrivée: {formatDateFr(booking.StartDate)}</span>
                                    </div>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        <span>Départ: {formatDateFr(booking.EndDate)}</span>
                                    </div>
                                    <div className="flex items-center pl-4 text-sm text-gray-700 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 lucide lucide-user w-4 mr-1"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                                             strokeLinejoin="round">
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        <span>Nombre de personnes: {booking.nbPerson}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Aucune réservation passée.</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Mes informations</h2>
            <div className="space-y-4">
                <div>
                    <strong>Email:</strong> {user.email}
                </div>
                <div>
                    <strong>Pseudo:</strong> {user.pseudo}
                </div>
                <div>
                    <strong>Rôle:</strong> {user.role === 2 ? 'Admin' : user.role === 1 ? 'Employé' : 'Utilisateur'}
                </div>
            </div>
            <h2 className="text-xl font-semibold mt-8 mb-6">Mes réservations</h2>
            {renderBookings()}
        </div>
    );
};

export default Dashboard;
