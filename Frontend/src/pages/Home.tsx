import { useState, useEffect } from 'react';
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import BannerChamber from "../assets/bannerChamber.jpg";
import BannerRestaurant from "../assets/bannerRestaurant.jpg";
import BannerSPA from "../assets/bannerSPA.jpg";

interface SlideType {
    url: string;
    title: string;
    description: string;
}

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

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

    // Dates pour la réservation
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800">
            <Header />
            <main className="flex-grow pt-16">
                <div className="relative h-screen">
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
                                className="w-full h-full object-cover opacity-50"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-black px-4">
                                    <h1 className="text-5xl font-light mb-2">{slide.title}</h1>
                                    <p className="text-xl mb-8">{slide.description}</p>
                                    <button className="bg-white text-white px-8 py-3 rounded-sm hover:bg-gold-500 hover:text-white transition-colors">
                                        Découvrir
                                    </button>
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
                <div className="relative mx-auto -mt-16 max-w-4xl px-4">
                    <div className="bg-white rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-light text-center mb-6">Réservez votre séjour</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Arrivée</label>
                                <input
                                    type="date"
                                    defaultValue={formatDate(today)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                                <input
                                    type="date"
                                    defaultValue={formatDate(tomorrow)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Personnes</label>
                                <select className="w-full p-2 border border-gray-300 rounded">
                                    <option>1 Adulte</option>
                                    <option>2 Adultes</option>
                                    <option>2 Adultes, 1 Enfant</option>
                                    <option>2 Adultes, 2 Enfants</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button className="w-full bg-gold-500 text-white p-2 rounded hover:bg-gold-600 transition-colors">
                                    Vérifier disponibilité
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;