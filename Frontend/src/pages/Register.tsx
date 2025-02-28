import React, {useState} from 'react';
import axios from 'axios';
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/users/register', {email, password, pseudo});
            setMessage(response.data.message);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data.error || 'An error occurred');
            } else {
                setMessage('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main
                className="flex-grow flex items-center justify-center container mx-auto px-4 pt-24"> {/* Center the content */}
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-light text-center mb-12">Inscription</h2>
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Mot de passe <span
                                className="text-red-500">*</span></label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Pseudo <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={pseudo}
                                onChange={(e) => setPseudo(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-2 rounded">S'inscrire</button>
                        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
                        <p className="mt-2 text-center">Vous avez déjà un compte ? <a href="/login">Se connecter</a></p>
                    </form>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default Register;