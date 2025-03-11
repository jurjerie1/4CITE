import { render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';

describe('Login Page', () => {
    it('renders the login form', () => {
        render(<Login />);
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Connexion/i })).toBeInTheDocument();
    });
});