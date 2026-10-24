import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { getDoc } from 'firebase/firestore';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import profile from './data/profile.json';

jest.mock('./lib/firebase', () => ({ auth: {}, db: {} }));
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(() => jest.fn()),
  signOut: jest.fn()
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn()
}));

const renderHome = () => render(
  <HelmetProvider>
    <AuthProvider><Home /></AuthProvider>
  </HelmetProvider>
);

beforeEach(() => {
  getDoc.mockReset();
});

test('shows the real biography while Firebase auth and content are still loading', () => {
  getDoc.mockReturnValue(new Promise(() => {}));
  renderHome();
  expect(screen.getByRole('heading', { name: profile.name })).toBeInTheDocument();
  expect(screen.getByText(/I now live in New York City and work on the evaluations team at General Intuition/)).toBeInTheDocument();
  expect(screen.queryByText('Welcome to my portfolio.')).not.toBeInTheDocument();
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

test('keeps the biography and concise search description when Firebase fails', async () => {
  const errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});
  getDoc.mockRejectedValue(new Error('Offline'));
  renderHome();
  await waitFor(() => expect(errorLog).toHaveBeenCalled());
  expect(screen.getByText(/evaluations team at General Intuition/)).toBeInTheDocument();
  await waitFor(() => {
    expect(document.title).toBe(profile.title);
    expect(document.querySelector('meta[name="description"]').content).toBe(profile.description);
  });
  errorLog.mockRestore();
});

test('still refreshes the visible biography from Firebase', async () => {
  getDoc.mockResolvedValue({
    exists: () => true,
    data: () => ({ introduction: 'An updated biography from the content editor.' })
  });
  renderHome();
  expect(await screen.findByText('An updated biography from the content editor.')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: profile.name })).toHaveAttribute('src', profile.imageUrl);
});
