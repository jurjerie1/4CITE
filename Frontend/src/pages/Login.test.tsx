import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';

describe('Login Page', () => {
    it('renders the login form', () => {
        render(<Login />);
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Connexion/i })).toBeInTheDocument();
    });

    it('updates email and password fields on change', () => {
        render(<Login />);
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });
});