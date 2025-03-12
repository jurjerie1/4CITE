import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

// Composants pour chaque rôle
import AdminContent from '../components/dashboard/AdminContent';
import EmployeeContent from '../components/dashboard/EmployeeContent';
import UserContent from '../components/dashboard/UserContent';

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');

        console.log('Stored user:', storedUser);
        if (!token) {
            navigate('/login');
            return;
        }

        // Récupérer les informations à jour de l'utilisateur
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        };

        if (Object.keys(storedUser).length > 0) {
            setUser(storedUser);
            setLoading(false);
            // Chercher les données actualisées en arrière-plan
            fetchUserData();
        } else {
            fetchUserData();
        }
    }, [navigate]);

    // Fonction pour rendre le contenu approprié selon le rôle
    const renderDashboardContent = () => {
        if (!user) return null;

        switch (user.role) {
            case 2:
                return <AdminContent user={user} />;
            case 1:
                return <EmployeeContent user={user} />;
            case 0:
            default:
                return <UserContent user={user} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p>Chargement du dashboard...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold">
                                {user.role === 2 ? 'Dashboard Administrateur' :
                                    user.role === 1 ? 'Dashboard Employé' :
                                        'Mon Espace Personnel'}
                            </h1>
                            <div className="bg-gray-100 px-4 py-2 rounded-full">
                                <span className="font-medium">{user.name}</span>
                                <span className="ml-2 text-sm text-gray-600">
                                    {user.role === 2 ? '(Admin)' :
                                        user.role === 1 ? '(Employé)' :
                                            '(Utilisateur)'}
                                </span>
                            </div>
                        </div>

                        {renderDashboardContent()}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;