'use client';
import withAuth from '@/hoc/withAuth';
import apiClient from '@/services/apiClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function CreateIncomePage() {
	const [name, setName] = useState<string>('New Income');
	const [amount, setAmount] = useState<number>(0);
	const today = new Date().toISOString().split('T')[0];
	const [date, setDate] = useState<Date>(new Date(today));
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const router = useRouter();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;

		if (name === 'name') {
			setName(value);
		} else if (name === 'amount') {
			setAmount(parseFloat(value));
		} else if (name === 'date') {
			setDate(new Date(value));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const response = await apiClient.post('/incomes/create', {
				name,
				amount,
				date: date ? date.toISOString().split('T')[0] : null,
			});
			router.push(`/incomes/${response.data.data.id}`);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col gap-8'>
			<h2 className='font-bold text-2xl text-foreground'>
				Create Income
			</h2>
			{error && (
				<div className='text-foreground bg-danger p-4 rounded-md mb-4'>
					{error.message}
				</div>
			)}
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='form-group'>
					<label htmlFor='name'>Name</label>
					<input
						type='text'
						name='name'
						id='name'
						value={name}
						onChange={handleChange}
					/>
				</div>
				<div className='grid grid-cols-2 gap-4'>
					<div className='form-group'>
						<label htmlFor='amount'>Amount</label>
						<input
							type='number'
							name='amount'
							id='amount'
							value={amount}
							onChange={handleChange}
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='date'>Date</label>
						<input
							type='date'
							name='date'
							id='date'
							onChange={handleChange}
							value={
								date ? date.toISOString().substring(0, 10) : ''
							}
						/>
					</div>
				</div>
				<div className='flex justify-end gap-4 pt-4'>
					{loading && (
						<div className='w-full flex justify-center items-center'>
							<svg
								className='animate-spin h-5 w-5 mr-3 text-foreground'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
							</svg>
							Processing...
						</div>
					)}
					<button
						type='submit'
						className='bg-primary text-onprimary font-semibold rounded-md px-4 py-2 transition hover:bg-primary-dark'>
						Create
					</button>
				</div>
			</form>
		</div>
	);
}

export default withAuth(CreateIncomePage);
