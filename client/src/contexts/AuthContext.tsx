// contexts/AuthContext.tsx
'use client'; // Add this line at the top of the file

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { login as apiLogin } from '@/services/apiClient';

interface User {
	username: string | null;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: Error | null;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			setLoading(true);
			try {
				await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`,
					{ withCredentials: true }
				);
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/api/user`,
					{ withCredentials: true }
				);
				setUser(response.data.data.username);
				router.push('/');
			} catch (err) {
				setError(err as Error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	const login = async (username: string, password: string) => {
		setLoading(true);
		try {
			const response = await apiLogin(username, password);
			setUser(response);
			router.push('/');
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
				{},
				{ withCredentials: true }
			);
			setUser(null);
			router.push('/login');
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthContext.Provider value={{ user, loading, error, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
