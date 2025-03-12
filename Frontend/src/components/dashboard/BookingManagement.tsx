import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Picture from "../../assets/picture.jpg";

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

interface BookingManagementProps {
    onBookingUpdate: () => void;
}

const BookingManagement: React.FC<BookingManagementProps> = ({ onBookingUpdate }) => {
    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [filters, setFilters] = useState({
        limit: 10,
        page: 0,
        date: '',
        userName: '',
        userEmail: '',
        hotelName: ''
    });
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [bookingForm, setBookingForm] = useState<Partial<Booking>>({
        StartDate: '',
        EndDate: '',
        nbPerson: 1
    });
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.date) params.append('date', filters.date);
            if (filters.userName) params.append('userName', filters.userName);
            if (filters.userEmail) params.append('userEmail', filters.userEmail);
            if (filters.hotelName) params.append('hotelName', filters.hotelName);

            const response = await axios.get(`http://localhost:3000/api/bookings/getAllBookings?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllBookings(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des réservations:', error);
        }
    };

    const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBookingForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!selectedBooking) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            const bookingData = {
                startDate: bookingForm.StartDate,
                endDate: bookingForm.EndDate,
                nbPerson: bookingForm.nbPerson
            };

            await axios.put(
                `http://localhost:3000/api/bookings/${selectedBooking._id}`,
                bookingData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setIsBookingModalOpen(false);
            fetchBookings();
            onBookingUpdate();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la réservation:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModifyBooking = (bookingId: string) => {
        const bookingToModify = allBookings.find(booking => booking._id === bookingId);
        if (bookingToModify) {
            setSelectedBooking(bookingToModify);
            setBookingForm({
                StartDate: bookingToModify.StartDate,
                EndDate: bookingToModify.EndDate,
                nbPerson: bookingToModify.nbPerson
            });
            setIsBookingModalOpen(true);
        }
    };

    const handleDeleteBooking = async (bookingId: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Non authentifié. Veuillez vous reconnecter.');
                return;
            }

            await axios.delete(`http://localhost:3000/api/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Réservation supprimée avec succès!');
            fetchBookings();
            onBookingUpdate();
        } catch (error) {
            console.error('Erreur lors de la suppression de la réservation:', error);
            alert('Erreur lors de la suppression de la réservation. Veuillez réessayer.');
        }
    };

    const formatDateFr = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return date.toLocaleDateString('fr-FR', options);
    };

    const BookingCard = ({ booking }: { booking: Booking }) => {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-md transition-shadow">
                {booking.hotel.picture_list && booking.hotel.picture_list.length > 0 ? (
                    <img
                        src={`http://localhost:3000${booking.hotel.picture_list[0]}`}
                        alt={`${booking.hotel.name} - Image`}
                        className="w-full h-48 object-cover"
                    />
                ) : (
                    <img
                        src={Picture}
                        alt={`${booking.hotel.name} - Image par défaut`}
                        className="w-full h-48 rounded-md object-cover"
                    />
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
                <div className="flex justify-end space-x-2 p-4">
                    <button
                        onClick={() => handleModifyBooking(booking._id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    >
                        Modifier
                    </button>
                    <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                        Supprimer
                    </button>
                </div>
                {isBookingModalOpen && selectedBooking && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <h3 className="text-xl font-semibold mb-4">Modifier la réservation</h3>
                            <form onSubmit={handleBookingSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Date de début</label>
                                    <input
                                        type="date"
                                        name="StartDate"
                                        value={bookingForm.StartDate}
                                        onChange={handleBookingChange}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Date de fin</label>
                                    <input
                                        type="date"
                                        name="EndDate"
                                        value={bookingForm.EndDate}
                                        onChange={handleBookingChange}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Nombre de personnes</label>
                                    <input
                                        type="number"
                                        name="nbPerson"
                                        value={bookingForm.nbPerson}
                                        onChange={handleBookingChange}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsBookingModalOpen(false)}
                                        className="border border-gray-300 px-4 py-2 rounded mr-2"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Modification...' : 'Modifier'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Limitation par page</label>
                    <input
                        type="number"
                        value={filters.limit}
                        onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de page(s)</label>
                    <input
                        type="number"
                        value={filters.page}
                        onChange={(e) => setFilters({ ...filters, page: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date (Réservations après cette date)</label>
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pseudo de l'utilisateur</label>
                    <input
                        type="text"
                        value={filters.userName}
                        onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email de l'utilisateur</label>
                    <input
                        type="email"
                        value={filters.userEmail}
                        onChange={(e) => setFilters({ ...filters, userEmail: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom de l'hôtel</label>
                    <input
                        type="text"
                        value={filters.hotelName}
                        onChange={(e) => setFilters({ ...filters, hotelName: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
            </div>
            <button
                onClick={fetchBookings}
                className="bg-black mb-4 text-white px-4 py-2 rounded"
            >
                Filtrer
            </button>
            {allBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allBookings.map(booking => (
                        <BookingCard key={booking._id} booking={booking} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">Aucune réservation trouvée.</p>
            )}
        </div>
    );
};

export default BookingManagement;