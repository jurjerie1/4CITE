import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('Login Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('renders the login form', () => {
        render(<Login />);
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Connexion/i })).toBeInTheDocument();
    });

    it('updates input values when user types', () => {
        render(<Login />);
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('displays registration link', () => {
        render(<Login />);
        const registerLink = screen.getByText(/S'inscrire/i);
        expect(registerLink).toBeInTheDocument();
        expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('submits the form and handles successful login', async () => {
        const mockUser = { id: 1, name: 'User Test', email: 'test@example.com' };
        const mockToken = 'fake-token-123';
        const mockResponse = {
            data: {
                message: 'Connexion réussie',
                user: mockUser,
                token: mockToken
            }
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        render(<Login />);

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);
        const submitButton = screen.getByRole('button', { name: /Connexion/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:3000/api/users/login',
                { email: 'test@example.com', password: 'password123' }
            );
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
            expect(localStorage.getItem('token')).toBe(mockToken);
        });
    });

    it('handles unexpected errors during login', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));
        mockedAxios.isAxiosError.mockReturnValueOnce(false);

        render(<Login />);

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);
        const submitButton = screen.getByRole('button', { name: /Connexion/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Une erreur inattendue est survenue')).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it('validates required fields', async () => {
        render(<Login />);

        const submitButton = screen.getByRole('button', { name: /Connexion/i });
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);

        expect(emailInput).toBeRequired();
        expect(passwordInput).toBeRequired();

        fireEvent.click(submitButton);
        expect(mockedAxios.post).not.toHaveBeenCalled();
    });
});