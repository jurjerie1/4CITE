import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import { act } from 'react';

jest.mock('../assets/bannerChamber.jpg', () => 'banner-chamber-mock');
jest.mock('../assets/bannerRestaurant.jpg', () => 'banner-restaurant-mock');
jest.mock('../assets/bannerSPA.jpg', () => 'banner-spa-mock');
jest.mock('../assets/picture.jpg', () => 'picture-mock');

jest.mock('../components/Header.tsx', () => () => <div data-testid="header-mock">Header</div>);
jest.mock('../components/Footer.tsx', () => () => <div data-testid="footer-mock">Footer</div>);

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Home Component', () => {
    const mockHotels = [
        {
            _id: 1,
            name: 'Hotel Luxe',
            location: 'Paris, France',
            description: 'Un hôtel magnifique au cœur de Paris',
            picture_list: ['/images/hotel1.jpg']
        },
        {
            _id: 2,
            name: 'Beach Resort',
            location: 'Nice, France',
            description: 'Profitez de la plage et du soleil',
            picture_list: ['/images/hotel2.jpg']
        }
    ];

    const mockBookings = [
        {
            _id: '123',
            hotelId: 1,
            userId: 'user1',
            startDate: '2025-03-20',
            endDate: '2025-03-25',
            nbPerson: 2
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        mockFetch.mockImplementation((url) => {
            if (url === 'http://localhost:3000/api/hotels') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockHotels)
                });
            }
            if (url === 'http://localhost:3000/api/bookings/GetAllBookings') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockBookings)
                });
            }
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'Not found' })
            });
        });
    });

    it('renders the home page with header and footer', async () => {
        await act(async () => {
            render(<Home />);
        });

        expect(screen.getByTestId('header-mock')).toBeInTheDocument();
        expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
        expect(screen.getByText('Trouvez votre hôtel idéal')).toBeInTheDocument();
    });

    it('displays hotels after they are loaded', async () => {
        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(screen.getByText('Hotel Luxe')).toBeInTheDocument();
            expect(screen.getByText('Beach Resort')).toBeInTheDocument();
        });
    });

    it('updates search form when user enters information', async () => {
        await act(async () => {
            render(<Home />);
        });

        const destinationInput = screen.getByLabelText(/Destination/i);
        fireEvent.change(destinationInput, { target: { value: 'Paris' } });

        const arrivalInput = screen.getByLabelText(/Arrivée/i);
        fireEvent.change(arrivalInput, { target: { value: '2025-04-01' } });

        const departureInput = screen.getByLabelText(/Départ/i);
        fireEvent.change(departureInput, { target: { value: '2025-04-05' } });

        const travelersSelect = screen.getByLabelText(/Voyageurs/i);
        fireEvent.change(travelersSelect, { target: { value: '2' } });

        expect(destinationInput).toHaveValue('Paris');
        expect(arrivalInput).toHaveValue('2025-04-01');
        expect(departureInput).toHaveValue('2025-04-05');
        expect(travelersSelect).toHaveValue('2');
    });

    it('performs a search for available hotels', async () => {
        await act(async () => {
            render(<Home />);
        });

        const destinationInput = screen.getByLabelText(/Destination/i);
        fireEvent.change(destinationInput, { target: { value: 'Paris' } });

        const searchButton = screen.getByRole('button', { name: /Rechercher/i });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText('Hotel Luxe')).toBeInTheDocument();
        });
    });

    it('handles error when loading hotels fails', async () => {
        mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'Erreur serveur' })
            })
        );

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(screen.getByText('Erreur lors du chargement des hôtels')).toBeInTheDocument();
        });
    });

    it('opens the booking modal when "Réserver maintenant" is clicked', async () => {
        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(screen.getByText('Hotel Luxe')).toBeInTheDocument();
        });

        const bookButtons = screen.getAllByText('Réserver maintenant');
        fireEvent.click(bookButtons[0]);

        expect(screen.getByText('Réserver chez Hotel Luxe')).toBeInTheDocument();
        expect(screen.getByLabelText('Date d\'arrivée')).toBeInTheDocument();
        expect(screen.getByLabelText('Date de départ')).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre de personnes')).toBeInTheDocument();
    });

    it('handles successful booking submission', async () => {
        mockLocalStorage.getItem.mockReturnValue('dummy-token');

        mockFetch.mockImplementation((url) => {
            if (url === 'http://localhost:3000/api/hotels') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockHotels)
                });
            }
            if (url === 'http://localhost:3000/api/bookings/GetAllBookings') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockBookings)
                });
            }
            if (url.includes('http://localhost:3000/api/bookings/1')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ message: 'Réservation créée avec succès' })
                });
            }
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'Not found' })
            });
        });

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(screen.getByText('Hotel Luxe')).toBeInTheDocument();
        });

        const bookButtons = screen.getAllByText('Réserver maintenant');
        fireEvent.click(bookButtons[0]);

        const confirmButton = screen.getByRole('button', { name: /Confirmer la réservation/i });
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(screen.getByText('Réservation effectuée avec succès!')).toBeInTheDocument();
        });
    });

    it('handles booking error when user is not logged in', async () => {
        mockLocalStorage.getItem.mockReturnValue(null);

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(screen.getByText('Hotel Luxe')).toBeInTheDocument();
        });

        const bookButtons = screen.getAllByText('Réserver maintenant');
        fireEvent.click(bookButtons[0]);

        const confirmButton = screen.getByRole('button', { name: /Confirmer la réservation/i });
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(screen.getByText('Vous devez être connecté pour effectuer une réservation')).toBeInTheDocument();
        });
    });

    it('handles API error during booking submission', async () => {
        mockLocalStorage.getItem.mockReturnValue('dummy-token');

        const mockErrorMessage = 'Cet hôtel est déjà réservé pour ces dates';
        mockFetch.mockImplementation((url) => {
            if (url === 'http://localhost:3000/api/hotels') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockHotels)
                });
            }
            if (url === 'http://localhost:3000/api/bookings/GetAllBookings') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockBookings)
                });
            }
            if (url.includes('http://localhost:3000/api/bookings/1')) {
                return Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({ message: mockErrorMessage })
                });
            }
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'Not found' })
            });
        });

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(screen.getByText('Hotel Luxe')).toBeInTheDocument();
        });

        const bookButtons = screen.getAllByText('Réserver maintenant');
        fireEvent.click(bookButtons[0]);

        const confirmButton = screen.getByRole('button', { name: /Confirmer la réservation/i });
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(screen.getByText(mockErrorMessage)).toBeInTheDocument();
        });
    });
});