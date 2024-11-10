'use client';
import { useAuth } from '@/contexts/AuthContext';
import withAuth from '@/hoc/withAuth';
import apiClient from '@/services/apiClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Category {
	id: number;
	name: string;
}

function CreateExpensePage() {
	const [name, setName] = useState<string>('New Expense');
	const [amount, setAmount] = useState<number>(0);
	const [category, setCategory] = useState<Category | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
	const today = new Date().toISOString().split('T')[0];
	const [date, setDate] = useState<Date>(new Date(today));
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const fetchCategories = async () => {
			setCategoriesLoading(true);
			try {
				const response = await apiClient.get(`/${user}/categories`);
				const categories: Category[] = response.data.data;
				setCategories(categories);
			} catch (err) {
				console.error(err);
				setError(err as Error);
			} finally {
				setCategoriesLoading(false);
			}
		};

		fetchCategories();
	}, [user]);

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
			const response = await apiClient.post('/expenses/create', {
				name,
				amount,
				category_id: category?.id ? category.id : null,
				date: date ? date.toISOString().split('T')[0] : null,
			});
			router.push(`/expenses/${response.data.data.id}`);
		} catch (err) {
			console.error(err);
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='grid grid-cols-2 gap-8 bg-background text-foreground'>
			<div className='col-span-2'>
				<h2 className='font-bold text-2xl text-foreground'>
					Expense Details
				</h2>
			</div>
			<div>
				{error && (
					<div className='text-foreground bg-danger p-4 rounded-md mb-4'>
						{error.message}
					</div>
				)}
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='form-group'>
						<label>Expense Name</label>
						<input
							type='text'
							name='name'
							value={name}
							onChange={handleChange}
							placeholder='Enter expense name'
						/>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						<div className='form-group'>
							<label>Amount</label>
							<input
								type='number'
								name='amount'
								value={amount}
								onChange={handleChange}
								placeholder='Enter amount'
							/>
						</div>
						<div className='form-group'>
							<label>Date</label>
							<input
								type='date'
								name='date'
								value={
									date
										? date.toISOString().substring(0, 10)
										: ''
								}
								onChange={handleChange}
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
			<div>
				<h3 className='text-lg font-semibold mb-4 text-foreground'>
					Categories
				</h3>
				{categoriesLoading && (
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
				<div className='space-y-2'>
					{!categoriesLoading && (
						<div
							className={`p-3 rounded-md hover:bg-secondary cursor-pointer ${
								category === null &&
								'bg-secondary text-onsecondary'
							}`}
							onClick={() => setCategory(null)}>
							None
						</div>
					)}
					{categories.map(cat => (
						<div
							key={cat.id}
							onClick={() => setCategory(cat)}
							className={`p-3 rounded-md hover:bg-secondary cursor-pointer ${
								category?.id === cat.id &&
								'bg-secondary text-onsecondary'
							}`}>
							{cat.name}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default withAuth(CreateExpensePage);
