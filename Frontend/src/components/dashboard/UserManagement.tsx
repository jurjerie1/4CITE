import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    _id: number;
    email: string;
    pseudo?: string;
    role: number;
}

interface NewUserFormData {
    email: string;
    pseudo?: string;
    password: string;
    role: number;
}

interface UserManagementProps {
    onUserUpdate: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onUserUpdate }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUserForm, setNewUserForm] = useState<NewUserFormData>({
        email: '',
        pseudo: '',
        password: '',
        role: 0
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editUserForm, setEditUserForm] = useState<NewUserFormData>({
        email: '',
        pseudo: '',
        password: '',
        role: 0
    });
    const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get('http://localhost:3000/api/users/getAll', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
        }
    };

    const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUserForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUpdateMessage(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUpdateMessage({ type: 'error', text: 'Non authentifié. Veuillez vous reconnecter.' });
                return;
            }

            await axios.post(
                'http://localhost:3000/api/users/register',
                newUserForm,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setUpdateMessage({ type: 'success', text: 'Nouvel utilisateur créé avec succès!' });
            setNewUserForm({ email: '', pseudo: '', password: '', role: 0 });
            setIsModalOpen(false);
            fetchUsers();
            onUserUpdate();
        } catch (error) {
            console.error('Erreur lors de la création du nouvel utilisateur:', error);
            setUpdateMessage({
                type: 'error',
                text: 'Erreur lors de la création du nouvel utilisateur. Veuillez réessayer.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditUserForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUpdateMessage(null);

        if (!selectedUser) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUpdateMessage({ type: 'error', text: 'Non authentifié. Veuillez vous reconnecter.' });
                return;
            }

            const formData: Partial<NewUserFormData> = {};
            if (editUserForm.email !== selectedUser.email) formData.email = editUserForm.email;
            if (editUserForm.pseudo !== selectedUser.pseudo) formData.pseudo = editUserForm.pseudo;
            if (editUserForm.password) formData.password = editUserForm.password;
            if (editUserForm.role !== selectedUser.role) formData.role = editUserForm.role;

            await axios.put(
                `http://localhost:3000/api/users/${selectedUser._id}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setUpdateMessage({ type: 'success', text: 'Utilisateur mis à jour avec succès!' });
            setIsEditModalOpen(false);
            fetchUsers();
            onUserUpdate();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            setUpdateMessage({
                type: 'error',
                text: 'Erreur lors de la mise à jour de l\'utilisateur. Veuillez réessayer.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditUserForm({
            email: user.email,
            pseudo: user.pseudo || '',
            password: '',
            role: user.role
        });
        setIsEditModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    +
                </button>
            </div>
            {users.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border">Email</th>
                        <th className="py-2 px-4 border">Pseudo</th>
                        <th className="py-2 px-4 border">Rôle</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td className="py-2 px-4 border-b border-l border-r text-center">{user.email}</td>
                            <td className="py-2 px-4 border-b border-l border-r text-center">{user.pseudo}</td>
                            <td className="py-2 px-4 border-b border-l border-r text-center">{user.role === 2 ? 'Admin' : user.role === 1 ? 'Employé' : 'Utilisateur'}</td>
                            <td className="py-2 px-4 border-b border-l border-r text-center">
                                <button
                                    onClick={() => handleEditUser(user)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Modifier
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500 italic">Aucun utilisateur trouvé.</p>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Créer un nouvel utilisateur</h3>
                        {updateMessage && (
                            <div className={`mb-4 p-3 rounded ${
                                updateMessage.type === 'success' ? 'bg-green-100 text-green-800' :
                                    updateMessage.type === 'error' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                            }`}>
                                {updateMessage.text}
                            </div>
                        )}
                        <form onSubmit={handleNewUserSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newUserForm.email}
                                    onChange={handleNewUserChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Pseudo</label>
                                <input
                                    type="text"
                                    name="pseudo"
                                    value={newUserForm.pseudo}
                                    onChange={handleNewUserChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Mot de passe</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newUserForm.password}
                                    onChange={handleNewUserChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Rôle</label>
                                <select
                                    name="role"
                                    value={newUserForm.role}
                                    onChange={handleNewUserChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                >
                                    <option value={0}>Utilisateur</option>
                                    <option value={1}>Employé</option>
                                    <option value={2}>Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
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

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Modifier l'utilisateur</h3>
                        {updateMessage && (
                            <div className={`mb-4 p-3 rounded ${
                                updateMessage.type === 'success' ? 'bg-green-100 text-green-800' :
                                    updateMessage.type === 'error' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                            }`}>
                                {updateMessage.text}
                            </div>
                        )}
                        <form onSubmit={handleEditUserSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editUserForm.email}
                                    onChange={handleEditUserChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Pseudo</label>
                                <input
                                    type="text"
                                    name="pseudo"
                                    value={editUserForm.pseudo}
                                    onChange={handleEditUserChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Mot de passe</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={editUserForm.password}
                                    onChange={handleEditUserChange}
                                    className="w-full px-3 py-2 border rounded"
                                    placeholder="Laissez vide pour ne pas changer"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Rôle</label>
                                <select
                                    name="role"
                                    value={editUserForm.role}
                                    onChange={handleEditUserChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                >
                                    <option value={0}>Utilisateur</option>
                                    <option value={1}>Employé</option>
                                    <option value={2}>Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
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

export default UserManagement;
