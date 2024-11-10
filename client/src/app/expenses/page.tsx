'use client';

import withAuth from '@/hoc/withAuth';
import apiClient from '@/services/apiClient';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Category {
	id: number;
	name: string;
}

interface Expense {
	id: number;
	name: string;
	amount: number;
	category: Category | null;
	date: string;
}

function Expenses() {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [currentOpenedMenu, setCurrentOpenedMenu] = useState<number | null>(
		null
	);
	const [error, setError] = useState<Error | null>(null);
	const [isFetchingSuccess, setIsFetchingSuccess] = useState<boolean>(false);

	useEffect(() => {
		const fetchExpenses = async () => {
			setLoading(true);
			try {
				const response = await apiClient.get('/expenses');
				setExpenses(response.data.data);
				setIsFetchingSuccess(true);
			} catch (err) {
				console.error(err);
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchExpenses();
	}, []);

	const handleMenuClick = (id: number) => {
		setCurrentOpenedMenu(prev => (prev === id ? null : id));
	};

	const deleteExpense = async (id: number) => {
		setLoading(true);
		try {
			await apiClient.delete(`/expenses/${id}`);
			setExpenses(prevExpenses =>
				prevExpenses.filter(expense => expense.id !== id)
			);
		} catch (err) {
			console.error(err as Error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col gap-8'>
			<h2 className='text-2xl font-bold'>Expenses</h2>
			{error && (
				<div className='text-foreground bg-danger p-4 rounded-md mb-4'>
					{error.message}
				</div>
			)}
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
			{isFetchingSuccess && (
				<div className='w-full'>
					<table className='min-w-full bg-transparent border-white'>
						<thead>
							<tr>
								<th className='py-2 px-4 border-b text-left'></th>
								<th className='py-2 px-4 border-b text-left'>
									Name
								</th>
								<th className='py-2 px-4 border-b text-left'>
									Amount
								</th>
								<th className='py-2 px-4 border-b text-left'>
									Category
								</th>
								<th className='py-2 px-4 border-b text-left'>
									Date
								</th>
							</tr>
						</thead>
						<tbody>
							{expenses.length === 0 ? (
								<tr>
									<td colSpan={5} className='py-4 text-left'>
										{!loading && <span>No Expenses</span>}
									</td>
								</tr>
							) : (
								expenses.map(expense => (
									<tr
										key={expense.id}
										className='text-left group'>
										<td className='py-2 px-4 border-b relative '>
											<div
												className='cursor-pointer w-full h-full'
												onClick={() => {
													handleMenuClick(expense.id);
												}}>
												<FontAwesomeIcon
													icon={faEllipsisV}
													className='invisible group-hover:visible'
												/>
											</div>
											{currentOpenedMenu ===
												expense.id && (
												<div className='absolute flex flex-col items-start w-[120px] top-full right-full mt-2 rounded-lg bg-secondary'>
													<h5 className='font-bold text-xs p-4 border-b w-full flex items-start'>
														Action
													</h5>
													<div
														className='hover:rounded-b-lg cursor-pointer hover:bg-secondary-dark w-full flex justify-start p-4'
														onClick={() => {
															deleteExpense(
																expense.id
															);
														}}>
														<button>Delete</button>
													</div>
												</div>
											)}
										</td>
										<td className='py-2 px-4 border-b '>
											<div className='flex justify-between items-center'>
												{expense.name}
												<Link
													href={`/expenses/${expense.id}`}
													className='px-4 py-2 text-xs bg-gray-900 rounded-lg invisible group-hover:visible'>
													OPEN
												</Link>
											</div>
										</td>
										<td className='py-2 px-4 border-b'>
											Rp{expense.amount}
										</td>
										<td className='py-2 px-4 border-b'>
											{expense.category?.name || 'None'}
										</td>
										<td className='py-2 px-4 border-b'>
											{expense.date}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default withAuth(Expenses);
