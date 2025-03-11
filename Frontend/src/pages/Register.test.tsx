import { render, screen} from '@testing-library/react';
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
});