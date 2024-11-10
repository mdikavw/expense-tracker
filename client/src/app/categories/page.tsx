'use client';

import withAuth from '@/hoc/withAuth';
import apiClient from '@/services/apiClient';
import React, { useEffect, useState } from 'react';

interface Category {
	id: number;
	name: string;
}

const CategoriesPage = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	useEffect(() => {
		const fetchCategories = async () => {
			setLoading(true);
			try {
				const response = await apiClient.get('/categories');
				setCategories(response.data.data);
			} catch (err) {
				console.error(err);
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);
	return (
		<div className='flex flex-col gap-4'>
			<h2 className='text-2xl font-bold'>Categories</h2>
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
			)}{' '}
			{error && (
				<div className='text-foreground bg-danger p-4 rounded-md mb-4'>
					{error.message}
				</div>
			)}
			<div className='grid gap-4 grid-cols-6'>
				{categories.map((category, index) => {
					const isEvenRowPattern = Math.floor(index / 3) % 2 === 1;
					const colSpan = isEvenRowPattern
						? 'col-span-3'
						: 'col-span-2';

					return (
						<div
							key={category.id}
							className={`p-4 border border-primary rounded-lg bg-secondary ${colSpan} hover:scale-105 transition-transform duration-200 cursor-pointer`}>
							{category.name}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default withAuth(CategoriesPage);
