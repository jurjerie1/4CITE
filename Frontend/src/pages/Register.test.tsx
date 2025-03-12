import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from './Register';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('Register Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the registration form', () => {
        render(<Register />);

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Pseudo/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
    });

    it('updates input values when user types', () => {
        render(<Register />);

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);
        const pseudoInput = screen.getByLabelText(/Pseudo/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(pseudoInput, { target: { value: 'testuser' } });

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
        expect(pseudoInput).toHaveValue('testuser');
    });

    it('displays login link', () => {
        render(<Register />);

        const loginLink = screen.getByText(/Se connecter/i);
        expect(loginLink).toBeInTheDocument();
        expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('submits the form and handles successful registration', async () => {
        const mockResponse = {
            data: {
                message: 'Inscription réussie'
            }
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        render(<Register />);

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);
        const pseudoInput = screen.getByLabelText(/Pseudo/i);
        const submitButton = screen.getByRole('button', { name: /S'inscrire/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(pseudoInput, { target: { value: 'testuser' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:3000/api/users/register',
                { email: 'test@example.com', password: 'password123', pseudo: 'testuser' }
            );
            expect(screen.getByText('Inscription réussie')).toBeInTheDocument();
        });
    });

    it('handles unexpected errors during registration', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));
        mockedAxios.isAxiosError.mockReturnValueOnce(false);

        render(<Register />);

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);
        const pseudoInput = screen.getByLabelText(/Pseudo/i);
        const submitButton = screen.getByRole('button', { name: /S'inscrire/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(pseudoInput, { target: { value: 'testuser' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
        });
    });

    it('validates required fields', async () => {
        render(<Register />);

        const submitButton = screen.getByRole('button', { name: /S'inscrire/i });
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);
        const pseudoInput = screen.getByLabelText(/Pseudo/i);

        expect(emailInput).toBeRequired();
        expect(passwordInput).toBeRequired();
        expect(pseudoInput).toBeRequired();

        fireEvent.click(submitButton);
        expect(mockedAxios.post).not.toHaveBeenCalled();
    });
});