import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ProfileFormData {
    email: string;
    pseudo: string;
    password: string;
}

interface User {
    _id: number;
    email: string;
    pseudo?: string;
    role: number;
}

interface ProfileFormProps {
    user: User;
    onProfileUpdate: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onProfileUpdate }) => {
    const [profileForm, setProfileForm] = useState<ProfileFormData>({
        email: user.email,
        pseudo: user.pseudo || '',
        password: ''
    });
    const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileDelete = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre profil ? Cette action est irréversible.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUpdateMessage({ type: 'error', text: 'Non authentifié. Veuillez vous reconnecter.' });
                return;
            }

            await axios.delete('http://localhost:3000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la suppression du profil:', error);
            setUpdateMessage({ type: 'error', text: 'Erreur lors de la suppression du profil. Veuillez réessayer.' });
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUpdateMessage(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUpdateMessage({ type: 'error', text: 'Non authentifié. Veuillez vous reconnecter.' });
                return;
            }

            const formData: Partial<ProfileFormData> = {};
            if (profileForm.email !== user.email) formData.email = profileForm.email;
            if (profileForm.pseudo !== user.pseudo) formData.pseudo = profileForm.pseudo;
            if (profileForm.password) formData.password = profileForm.password;

            if (Object.keys(formData).length === 0) {
                setUpdateMessage({ type: 'error', text: 'Aucune modification à enregistrer.' });
                setIsSubmitting(false);
                return;
            }

            await axios.put(
                `http://localhost:3000/api/users/${user._id}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setUpdateMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
            onProfileUpdate();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            setUpdateMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil. Veuillez réessayer.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Mon profil</h2>

            {updateMessage && (
                <div className={`mb-4 p-3 rounded ${
                    updateMessage.type === 'success' ? 'bg-green-100 text-green-800' :
                        updateMessage.type === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                }`}>
                    {updateMessage.text}
                </div>
            )}

            <form onSubmit={handleProfileSubmit}>
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:space-x-6">
                        <div className="md:w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Pseudo</label>
                                    <input
                                        type="text"
                                        name="pseudo"
                                        value={profileForm.pseudo}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={profileForm.password}
                                        onChange={handleProfileChange}
                                        placeholder="Laissez vide pour ne pas changer"
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Rôle</label>
                                    <input
                                        type="text"
                                        disabled
                                        value={user.role === 2 ? 'Admin' : user.role === 1 ? 'Employé' : 'Utilisateur'}
                                        className="w-full px-3 py-2 border rounded bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-between">
                        <div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                            <button
                                type="button"
                                className="border border-gray-300 px-4 py-2 rounded"
                                onClick={() => {
                                    setProfileForm({
                                        email: user.email,
                                        pseudo: user.pseudo || '',
                                        password: ''
                                    });
                                    setUpdateMessage(null);
                                }}
                            >
                                Annuler
                            </button>
                        </div>
                        <button
                            type="button"
                            className="bg-red-500 text-white px-4 py-2 rounded ml-auto"
                            onClick={handleProfileDelete}
                        >
                            Supprimer le profil
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;
