import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Hotel {
    _id: string;
    name: string;
    location: string;
    description?: string;
    picture_list?: string[];
}

interface HotelManagementProps {
    onHotelUpdate: () => void;
}

const HotelManagement: React.FC<HotelManagementProps> = ({ onHotelUpdate }) => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [hotelForm, setHotelForm] = useState<Partial<Hotel>>({
        name: '',
        location: '',
        description: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
    const [isEditHotelModalOpen, setIsEditHotelModalOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get('http://localhost:3000/api/hotels', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHotels(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des hôtels:', error);
        }
    };

    const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setHotelForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleHotelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUpdateMessage(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUpdateMessage({ type: 'error', text: 'Non authentifié. Veuillez vous reconnecter.' });
                return;
            }

            const response = await axios.post(
                'http://localhost:3000/api/hotels',
                hotelForm,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (imageFile && response.data._id) {
                const formData = new FormData();
                formData.append('images', imageFile);

                await axios.post(
                    `http://localhost:3000/api/hotels/${response.data._id}/upload`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            setUpdateMessage({ type: 'success', text: 'Hôtel créé avec succès!' });
            setHotelForm({
                name: '',
                location: '',
                description: '',
            });
            setImageFile(null);
            setIsHotelModalOpen(false);
            fetchHotels();
            onHotelUpdate();
        } catch (error) {
            console.error('Erreur lors de la création de l\'hôtel:', error);
            setUpdateMessage({ type: 'error', text: 'Erreur lors de la création de l\'hôtel. Veuillez réessayer.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditHotel = (hotel: Hotel) => {
        setSelectedHotel(hotel);
        setHotelForm({
            name: hotel.name,
            location: hotel.location,
            description: hotel.description || ''
        });
        setIsEditHotelModalOpen(true);
    };

    const handleEditHotelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUpdateMessage(null);

        if (!selectedHotel) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUpdateMessage({ type: 'error', text: 'Non authentifié. Veuillez vous reconnecter.' });
                return;
            }

            await axios.put(
                `http://localhost:3000/api/hotels/${selectedHotel._id}`,
                hotelForm,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (imageFile) {
                const formData = new FormData();
                formData.append('images', imageFile);

                await axios.post(
                    `http://localhost:3000/api/hotels/${selectedHotel._id}/upload`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            setUpdateMessage({ type: 'success', text: 'Hôtel mis à jour avec succès!' });
            setIsEditHotelModalOpen(false);
            fetchHotels();
            onHotelUpdate();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'hôtel:', error);
            setUpdateMessage({ type: 'error', text: 'Erreur lors de la mise à jour de l\'hôtel. Veuillez réessayer.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteHotel = async (hotelId: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ? Cette action est irréversible.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUpdateMessage({ type: 'error', text: 'Non authentifié. Veuillez vous reconnecter.' });
                return;
            }

            await axios.delete(`http://localhost:3000/api/hotels/${hotelId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUpdateMessage({ type: 'success', text: 'Hôtel supprimé avec succès!' });
            fetchHotels();
            onHotelUpdate();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'hôtel:', error);
            setUpdateMessage({ type: 'error', text: 'Erreur lors de la suppression de l\'hôtel. Veuillez réessayer.' });
        }
    };

    const handleDeleteImage = async (hotelId: string, fileId: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUpdateMessage({ type: 'error', text: 'Non authentifié. Veuillez vous reconnecter.' });
                return;
            }

            await axios.delete(`http://localhost:3000/api/hotels/${hotelId}/${fileId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUpdateMessage({ type: 'success', text: 'Image supprimée avec succès!' });

            if (selectedHotel) {
                const updatedPictureList = selectedHotel.picture_list?.filter(pic => pic.split('/').pop() !== fileId) || [];
                setSelectedHotel({ ...selectedHotel, picture_list: updatedPictureList });
            }

            fetchHotels();
            onHotelUpdate();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'image:', error);
            setUpdateMessage({ type: 'error', text: 'Erreur lors de la suppression de l\'image. Veuillez réessayer.' });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Liste des hôtels</h2>
                <button
                    onClick={() => setIsHotelModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    +
                </button>
            </div>

            {updateMessage && (
                <div className={`mb-4 p-3 rounded ${
                    updateMessage.type === 'success' ? 'bg-green-100 text-green-800' :
                        updateMessage.type === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                }`}>
                    {updateMessage.text}
                </div>
            )}

            {hotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hotels.map(hotel => (
                        <div key={hotel._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative">
                                {hotel.picture_list && hotel.picture_list.length > 0 ? (
                                    <div className="relative h-48">
                                        <img
                                            src={`http://localhost:3000${hotel.picture_list[0]}`}
                                            alt={`${hotel.name} - Image`}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">Aucune image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-blue-600 mb-1">{hotel.name}</h3>
                                <div className="flex items-center text-sm text-gray-700 mb-1">
                                    <span>📍 {hotel.location}</span>
                                </div>
                                {hotel.description && (
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{hotel.description}</p>
                                )}
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button
                                        onClick={() => handleEditHotel(hotel)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDeleteHotel(hotel._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">Aucun hôtel trouvé.</p>
            )}

            {isHotelModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">Ajouter un nouvel hôtel</h3>
                        <form onSubmit={handleHotelSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Nom de l'hôtel</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={hotelForm.name}
                                    onChange={handleHotelChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Emplacement</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={hotelForm.location}
                                    onChange={handleHotelChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={hotelForm.description}
                                    onChange={handleHotelChange}
                                    className="w-full px-3 py-2 border rounded"
                                    rows={3}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsHotelModalOpen(false)}
                                    className="border border-gray-300 px-4 py-2 rounded mr-2"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Création...' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditHotelModalOpen && selectedHotel && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">Modifier l'hôtel</h3>
                        <form onSubmit={handleEditHotelSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Nom de l'hôtel</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={hotelForm.name}
                                    onChange={handleHotelChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Emplacement</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={hotelForm.location}
                                    onChange={handleHotelChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={hotelForm.description}
                                    onChange={handleHotelChange}
                                    className="w-full px-3 py-2 border rounded"
                                    rows={3}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Ajouter une nouvelle image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            {selectedHotel.picture_list && selectedHotel.picture_list.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Images actuelles</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedHotel.picture_list.map((pic, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={`http://localhost:3000${pic}`}
                                                    alt={`Image ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteImage(selectedHotel._id, pic.split('/').pop() || '')}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsEditHotelModalOpen(false)}
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

export default HotelManagement;
