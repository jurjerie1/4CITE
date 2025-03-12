import { useState, useEffect } from 'react';
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import BannerChamber from "../assets/bannerChamber.jpg";
import BannerRestaurant from "../assets/bannerRestaurant.jpg";
import BannerSPA from "../assets/bannerSPA.jpg";
import Picture from "../assets/picture.jpg";

interface SlideType {
    url: string;
    title: string;
    description: string;
}

interface HotelType {
    _id: number;
    name: string;
    location?: string;
    description?: string;
    picture_list?: string[];
}

interface BookingFormData {
    startDate: string;
    endDate: string;
    nbPerson: number;
}

interface SearchFormData {
    destination: string;
    startDate: string;
    endDate: string;
    nbPerson: number;
}

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hotels, setHotels] = useState<HotelType[]>([]);
    const [filteredHotels, setFilteredHotels] = useState<HotelType[]>([]);
    const [availableHotels, setAvailableHotels] = useState<HotelType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookingStatus, setBookingStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [selectedHotel, setSelectedHotel] = useState<HotelType | null>(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [existingBookings, setExistingBookings] = useState<any[]>([]);

    // Format de date helper
    function formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    // Dates pour la recherche
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Formulaire de réservation
    const [bookingForm, setBookingForm] = useState<BookingFormData>({
        startDate: formatDate(today),
        endDate: formatDate(tomorrow),
        nbPerson: 1
    });

    // Formulaire de recherche
    const [searchForm, setSearchForm] = useState<SearchFormData>({
        destination: "",
        startDate: formatDate(today),
        endDate: formatDate(tomorrow),
        nbPerson: 1
    });

    // Récupérer la liste des hôtels depuis l'API
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/hotels');
                if (!response.ok) {
                    throw new Error('Problème lors de la récupération des hôtels');
                }
                const data = await response.json();

                setHotels(data);
                setFilteredHotels(data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des hôtels');
                setLoading(false);
                console.error('Erreur:', err);
            }
        };

        fetchHotels();
    }, []);

    // Récupérer toutes les réservations existantes
    useEffect(() => {
        const fetchAllBookings = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/bookings/GetAllBookings');
                if (!response.ok) {
                    throw new Error('Problème lors de la récupération des réservations');
                }
                const data = await response.json();
                setExistingBookings(data);
            } catch (err) {
                console.error('Erreur lors du chargement des réservations:', err);
            }
        };

        fetchAllBookings();
    }, []);

    // Filtrer par terme de recherche (destination)
    useEffect(() => {
        if (hotels.length && searchForm.destination) {
            const result = hotels.filter((hotel) => {
                const searchMatch = !searchForm.destination ||
                    hotel.name.toLowerCase().includes(searchForm.destination.toLowerCase()) ||
                    (hotel.location && hotel.location.toLowerCase().includes(searchForm.destination.toLowerCase()));

                return searchMatch;
            });

            setFilteredHotels(result);
        } else if (hotels.length && !searchForm.destination && !searchPerformed) {
            setFilteredHotels(hotels);
        }
    }, [hotels, searchForm.destination, searchPerformed]);

    // Vérifier la disponibilité d'un hôtel en utilisant les données existantes
    const checkHotelAvailability = (hotelId: number, startDate: string, endDate: string) => {
        // Convertir les dates en objets Date pour la comparaison
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Filtrer les réservations pour cet hôtel
        const hotelBookings = existingBookings.filter(booking => booking.hotelId === hotelId);

        // Vérifier s'il y a des chevauchements de dates
        for (const booking of hotelBookings) {
            const bookingStart = new Date(booking.startDate);
            const bookingEnd = new Date(booking.endDate);

            // Si les dates se chevauchent, l'hôtel n'est pas disponible
            if ((start <= bookingEnd && end >= bookingStart)) {
                return false;
            }
        }

        // Si aucun chevauchement n'est trouvé, l'hôtel est disponible
        return true;
    };

    // Rechercher des hôtels disponibles
    const searchAvailableHotels = () => {
        setSearching(true);
        setSearchPerformed(true);
        setError(null);

        try {
            // Pour chaque hôtel filtré par destination, vérifier la disponibilité
            const available = filteredHotels.filter(hotel =>
                checkHotelAvailability(
                    hotel._id,
                    searchForm.startDate,
                    searchForm.endDate
                )
            );

            setAvailableHotels(available);

            if (available.length === 0) {
                setError('Aucun hôtel disponible pour ces dates.');
            }

            setSearching(false);
        } catch (err) {
            console.error('Erreur lors de la recherche d\'hôtels disponibles:', err);
            setError('Erreur lors de la recherche. Veuillez réessayer.');
            setSearching(false);
        }
    };

    // Gérer les changements dans le formulaire de recherche
    const handleSearchFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSearchForm(prev => ({
            ...prev,
            [name]: name === 'nbPerson' ? parseInt(value) : value
        }));
    };

    // Gérer la soumission du formulaire de recherche
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        searchAvailableHotels();
    };

    // Images pour le slide
    const slides: SlideType[] = [
        {
            url: BannerChamber,
            title: "Chambre Deluxe",
            description: "Luxe et confort dans chaque détail"
        },
        {
            url: BannerRestaurant,
            title: "Restaurant Gastronomique",
            description: "Une expérience culinaire exceptionnelle"
        },
        {
            url: BannerSPA,
            title: "Spa & Bien-être",
            description: "Détendez-vous dans notre espace bien-être"
        }
    ];

    // Changement automatique de slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    // Ouvrir le modal de réservation
    const handleBookNow = (hotel: HotelType) => {
        console.log("Bouton réserver cliqué pour l'hôtel:", hotel);
        setSelectedHotelId(hotel._id);
        setSelectedHotel(hotel);
        setIsBookingModalOpen(true);

        // Si une recherche a été effectuée, utiliser les dates de recherche pour la réservation
        if (searchPerformed) {
            setBookingForm({
                startDate: searchForm.startDate,
                endDate: searchForm.endDate,
                nbPerson: searchForm.nbPerson
            });
        } else {
            // Sinon, utiliser les dates par défaut
            setBookingForm({
                startDate: formatDate(today),
                endDate: formatDate(tomorrow),
                nbPerson: 1
            });
        }
    };

    // Fermer le modal de réservation
    const closeBookingModal = () => {
        setIsBookingModalOpen(false);
        setSelectedHotelId(null);
        setSelectedHotel(null);
        setBookingStatus(null);
    };

    // Gérer les changements dans le formulaire de réservation
    const handleBookingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBookingForm(prev => ({
            ...prev,
            [name]: name === 'nbPerson' ? parseInt(value) : value
        }));
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedHotelId) {
            console.error("Aucun hôtel sélectionné", {
                isModalOpen: isBookingModalOpen,
                selectedHotel: selectedHotel,
                selectedHotelId: selectedHotelId
            });
            setBookingStatus({
                message: 'Erreur: Aucun hôtel sélectionné',
                type: 'error'
            });
            return;
        }

        try {
            const userToken = localStorage.getItem('token');

            if (!userToken) {
                console.error("L'utilisateur n'est pas connecté");
                setBookingStatus({
                    message: 'Vous devez être connecté pour effectuer une réservation',
                    type: 'error'
                });
                return;
            }

            const response = await fetch(`http://localhost:3000/api/bookings/${selectedHotelId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify(bookingForm)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Problème lors de la création de la réservation');
            }
            setBookingStatus({
                message: 'Réservation effectuée avec succès!',
                type: 'success'
            });

            // Mettre à jour les réservations existantes après une nouvelle réservation
            const bookingsResponse = await fetch('http://localhost:3000/api/bookings/GetAllBookings');
            if (bookingsResponse.ok) {
                const data = await bookingsResponse.json();
                setExistingBookings(data);
            }

            // Refaire la recherche si une recherche a été effectuée
            if (searchPerformed) {
                searchAvailableHotels();
            }

            setTimeout(() => {
                closeBookingModal();
            }, 2000);

        } catch (err) {
            console.error('Erreur lors de la réservation:', err);
            setBookingStatus({
                message: `${err.message}`,
                type: 'error'
            });
        }
    };

    const hotelsToDisplay = searchPerformed ? availableHotels : filteredHotels;

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800">
            <Header />
            <main className="flex-grow">
                <div className="relative h-[100vh]">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <img
                                src={slide.url}
                                alt={slide.title}
                                className="w-full h-full object-cover opacity-70"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-black px-4">
                                    <h1 className="text-5xl font-light mb-2">{slide.title}</h1>
                                    <p className="text-xl mb-8">{slide.description}</p>
                                    <a href="#hotels-section" className="bg-black text-white px-8 py-3 rounded hover:bg-blue-900 transition-colors">
                                        Découvrir nos hôtels
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full ${
                                    currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative mx-auto -mt-16 max-w-6xl px-4">
                    <div id="reservation" className="bg-white rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-light text-center mb-6">Trouvez votre hôtel idéal</h2>
                        <form onSubmit={handleSearchSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                                    <input
                                        type="text"
                                        name="destination"
                                        placeholder="Ville, région ou hôtel"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={searchForm.destination}
                                        onChange={handleSearchFormChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Arrivée</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={searchForm.startDate}
                                        onChange={handleSearchFormChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        min={formatDate(today)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={searchForm.endDate}
                                        onChange={handleSearchFormChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        min={searchForm.startDate}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Voyageurs</label>
                                    <select
                                        name="nbPerson"
                                        value={searchForm.nbPerson}
                                        onChange={handleSearchFormChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="1">1 Adulte</option>
                                        <option value="2">2 Adultes</option>
                                        <option value="3">3 Adultes</option>
                                        <option value="4">4 Adultes</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-center">
                                <button
                                    type="submit"
                                    className="bg-black text-white px-8 py-2 rounded hover:bg-blue-900 transition-colors"
                                    disabled={searching}
                                >
                                    {searching ? 'Recherche en cours...' : 'Rechercher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Section liste des hôtels */}
                <section id="hotels-section" className="py-12 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="text-3xl font-light mb-8">
                            {searchPerformed
                                ? `Hôtels disponibles (${hotelsToDisplay.length})`
                                : `Nos hôtels (${hotelsToDisplay.length})`}
                        </h2>

                        {searchPerformed && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <p>Résultats pour:
                                    <span className="font-semibold">
                                        {searchForm.destination ? ` ${searchForm.destination}, ` : ' '}
                                        du {searchForm.startDate} au {searchForm.endDate},
                                        {searchForm.nbPerson} {searchForm.nbPerson > 1 ? 'personnes' : 'personne'}
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Liste des hôtels */}
                            <div className="w-full">
                                {loading ? (
                                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                        <p>Chargement des hôtels...</p>
                                    </div>
                                ) : searching ? (
                                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                        <p>Recherche des disponibilités...</p>
                                    </div>
                                ) : error ? (
                                    <div className="bg-white rounded-lg shadow-md p-8 text-center text-red-600">
                                        <p>{error}</p>
                                    </div>
                                ) : hotelsToDisplay.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                        <p>Aucun hôtel ne correspond à vos critères.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {hotelsToDisplay.map((hotel) => (
                                            <div key={hotel._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                                <div className="flex flex-col md:flex-row">
                                                    {/* Image de l'hôtel */}
                                                    <div className="w-full h-48 md:w-1/3 md:h-auto">
                                                        {hotel.picture_list && hotel.picture_list.length > 0 ? (
                                                            <img
                                                                src={`http://localhost:3000${hotel.picture_list[0]}`}
                                                                alt={`${hotel.name} - Image`}
                                                                className="w-full h-48 object-cover"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={Picture}
                                                                alt={`${hotel.name} - Image par défaut`}
                                                                className="w-full h-48 md:h-full object-cover"
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Informations de l'hôtel */}
                                                    <div className="md:w-2/3 p-4 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between">
                                                                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                                                            </div>

                                                            {/* Emplacement */}
                                                            <p className="text-gray-600 mb-2">
                                                                <span className="inline-block mr-1">📍</span>
                                                                {hotel.location || "Emplacement central"}
                                                            </p>
                                                            {/* Description */}
                                                            <p className="text-gray-700 mb-4 line-clamp-2">
                                                                {hotel.description || "Aucune description disponible."}
                                                            </p>
                                                        </div>

                                                        {/* Bouton de réservation */}
                                                        <div className="mt-auto">
                                                            <button
                                                                onClick={() => handleBookNow(hotel)}
                                                                className="bg-black text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
                                                            >
                                                                Réserver maintenant
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            {/* Modal de réservation */}
            {isBookingModalOpen && selectedHotel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                                Réserver chez {selectedHotel.name}
                            </h3>
                            <button
                                onClick={closeBookingModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {bookingStatus && (
                            <div className={`mb-4 p-3 rounded ${
                                bookingStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {bookingStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleBookingSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date d'arrivée
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={bookingForm.startDate}
                                    onChange={handleBookingFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                    min={formatDate(today)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date de départ
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={bookingForm.endDate}
                                    onChange={handleBookingFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                    min={bookingForm.startDate}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre de personnes
                                </label>
                                <select
                                    name="nbPerson"
                                    value={bookingForm.nbPerson}
                                    onChange={handleBookingFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                >
                                    <option value="1">1 Adulte</option>
                                    <option value="2">2 Adultes</option>
                                    <option value="3">3 Adultes</option>
                                    <option value="4">4 Adultes</option>
                                </select>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Confirmer la réservation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;