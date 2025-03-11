import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from './Register';

describe('Register Page', () => {

    it('renders the registration form', () => {
        render(<Register />);
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Pseudo/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
    });

    it('updates email, password, and pseudo fields on change', () => {
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
});