import { useState, useEffect } from 'react';
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import BannerChamber from "../assets/bannerChamber.jpg";
import BannerRestaurant from "../assets/bannerRestaurant.jpg";
import BannerSPA from "../assets/bannerSPA.jpg";
import Picture from "../assets/picture.jpg";
import Picture2 from "../assets/picture2.jpg";
import Picture3 from "../assets/picture3.jpg";
import Picture4 from "../assets/picture4.jpg";

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
                                    <a href="#reservation" className="header-button px-8 py-3 rounded-sm hover:bg-gold-500 hover:text-white transition-colors">
                                        Réserver
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
                <div className="relative mx-auto -mt-16 max-w-4xl px-4">
                    <div id="reservation" className="bg-white rounded-lg shadow-xl p-6">
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
                <section className="py-16 px-4">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-light text-center mb-12">Nos Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gold-100">
                                    <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium mb-2">Chambres de luxe</h3>
                                <p className="text-gray-600">Profitez de nos chambres élégantes avec une vue panoramique et des équipements premium.</p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gold-100">
                                    <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium mb-2">Restaurant gastronomique</h3>
                                <p className="text-gray-600">Savourez une cuisine raffinée préparée par notre chef étoilé dans un cadre exceptionnel.</p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gold-100">
                                    <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium mb-2">Spa & Bien-être</h3>
                                <p className="text-gray-600">Détendez-vous dans notre spa luxueux avec piscine, sauna et massages professionnels.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-light text-center mb-12">Découvrez notre hôtel</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="overflow-hidden rounded">
                                <img src={Picture} alt="Hotel" className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="overflow-hidden rounded">
                                <img src={Picture2} alt="Hotel" className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="overflow-hidden rounded">
                                <img src={Picture3} alt="Hotel" className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="overflow-hidden rounded">
                                <img src={Picture4} alt="Hotel" className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;