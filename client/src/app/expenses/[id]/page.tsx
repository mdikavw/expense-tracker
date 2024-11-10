'use client';
import { useAuth } from '@/contexts/AuthContext';
import withAuth from '@/hoc/withAuth';
import apiClient from '@/services/apiClient';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Category {
	id: number;
	name: string;
}

function ExpensePage() {
	const { id } = useParams();
	const expenseId = id || '';
	const [name, setName] = useState<string>('New Expense');
	const [amount, setAmount] = useState<number>(0);
	const [category, setCategory] = useState<Category | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
	const [date, setDate] = useState<Date | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const [isFetchingSuccess, setIsFetchingSuccess] = useState<boolean>(false);
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

	useEffect(() => {
		const fetchExpense = async () => {
			setLoading(true);
			try {
				const response = await apiClient.get(`/expenses/${id}`);
				const expense = response.data.data;
				setName(expense.name);
				setAmount(expense.amount);
				setCategory(expense.category);
				setDate(new Date(expense.date));
				setIsFetchingSuccess(true);
			} catch (err) {
				console.error(err);
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchExpense();
	}, [id]);

	const deleteExpense = async (id: string) => {
		setLoading(true);
		try {
			await apiClient.delete(`/expenses/${id}`);
			router.push('/');
		} catch (err) {
			console.error(err as Error);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		console.log(name, value);
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
			await apiClient.put(`/expenses/${id}`, {
				name,
				amount,
				category_id: category?.id ? category.id : null,
				date: date ? date.toISOString().split('T')[0] : null,
			});
			router.replace(`/expenses/${id}`);
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
			{loading && (
				<div className='w-full col-span-2 flex justify-center items-center'>
					<svg
						className='animate-spin h-5 w-5 mr-3 text-gray-500'
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
			{!loading && (
				<>
					<div>
						{error && (
							<div className='text-foreground bg-danger p-4 rounded-md mb-4'>
								{error.message}
							</div>
						)}
						{isFetchingSuccess && (
							<form onSubmit={handleSubmit} className='space-y-6'>
								<div className='form-group'>
									<label className='block text-text-foreground'>
										Expense Name
									</label>
									<input
										type='text'
										name='name'
										value={name}
										onChange={handleChange}
										className='border border-secondary rounded-md px-4 py-2 bg-background text-text-foreground placeholder-gray-400 focus:border-primary focus:outline-none'
										placeholder='Enter expense name'
									/>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div className='form-group'>
										<label className='block text-text-foreground'>
											Amount
										</label>
										<input
											type='number'
											name='amount'
											value={amount}
											onChange={handleChange}
											className='border border-secondary rounded-md px-4 py-2 bg-background text-text-foreground placeholder-gray-400 focus:border-primary focus:outline-none'
											placeholder='Enter amount'
										/>
									</div>
									<div className='form-group'>
										<label className='block text-text-foreground'>
											Date
										</label>
										<input
											type='date'
											name='date'
											value={
												date
													? date
															.toISOString()
															.substring(0, 10)
													: ''
											}
											onChange={handleChange}
											className='border border-secondary rounded-md px-4 py-2 bg-background text-text-foreground focus:border-primary focus:outline-none'
										/>
									</div>
								</div>
								<div className='flex justify-end gap-4'>
									<button
										type='submit'
										className='bg-primary text-onprimary font-semibold rounded-md px-4 py-2 transition hover:bg-primary-dark'>
										Update
									</button>
									<button
										type='button'
										onClick={() =>
											deleteExpense(expenseId as string)
										}
										className='bg-danger text-onprimary font-semibold rounded-md px-4 py-2 transition hover:bg-danger-dark'>
										Delete
									</button>
								</div>
							</form>
						)}
					</div>
					{isFetchingSuccess && (
						<div>
							<h3 className='text-lg font-semibold mb-4 text-text-foreground'>
								Categories
							</h3>
							{categoriesLoading && (
								<div className='w-full flex justify-center items-center'>
									<svg
										className='animate-spin h-5 w-5 mr-3 text-gray-500'
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
					)}
				</>
			)}
		</div>
	);
}

export default withAuth(ExpensePage);
