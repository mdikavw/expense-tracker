'use client';
import React, { useState } from 'react';
import { register } from '@/services/apiClient';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await register(username, password, confirmPassword);
			router.push('/login');
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='w-full flex gap-4 justify-center flex-col items-center min-h-[100vh]'>
			<h2 className='font-bold text-2xl'>Register</h2>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<div className='auth-form-group'>
					<label htmlFor='username'>Username</label>
					<input
						type='text'
						id='username'
						value={username}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setUsername(e.target.value)
						}
					/>
				</div>
				<div className='auth-form-group'>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						value={password}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setPassword(e.target.value)
						}
					/>
				</div>
				<div className='auth-form-group'>
					<label htmlFor='password'>Confirm Password</label>
					<input
						type='password'
						id='confirmPassword'
						value={confirmPassword}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setConfirmPassword(e.target.value)
						}
					/>
				</div>
				{(loading || error) && (
					<div className='mt-4'>
						{loading && <span>Loading...</span>}
						{error && <span>{error.message}</span>}
					</div>
				)}
				<button className='rounded-lg bg-primary mt-4 px-4 py-2'>
					Register
				</button>
			</form>
			<span className='mt-4'>
				Already have an account?{' '}
				<a href='/login' className='underline'>
					Login Now
				</a>
			</span>
		</div>
	);
}