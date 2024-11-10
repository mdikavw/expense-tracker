import axios from 'axios';
import { useRouter } from 'next/navigation';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const apiClient = axios.create({
	baseURL: 'http://localhost:8000/api',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

apiClient.interceptors.response.use(
	response => response,
	error => {
		if (
			error.response &&
			(error.response.status === 401 || error.response.status === 419)
		) {
			const router = useRouter();
			router.push('/login');
		}
		return Promise.reject(error);
	}
);

const getCsrfToken = async () => {
	await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
		withCredentials: true,
	});
};

export const login = async (username: string, password: string) => {
	await getCsrfToken();
	const response = await apiClient.post('/login', { username, password });
	return response.data;
};

export const logout = async () => {
	await apiClient.post('/logout');
};

export const register = async (
	username: string,
	password: string,
	password_confirmation: string
) => {
	const response = await apiClient.post('/register', {
		username,
		password,
		password_confirmation,
	});
	return response.data;
};

export default apiClient;
