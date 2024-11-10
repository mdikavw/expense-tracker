'use client';
import DashboardCard from '@/components/DashboardCard';
import withAuth from '@/hoc/withAuth';
import apiClient from '@/services/apiClient';
import {
	faArrowDown,
	faArrowUp,
	faChartPie,
	faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

interface Category {
	id: number;
	name: string;
}

interface Expense {
	id: number;
	name: string;
	amount: string;
	category: Category;
	date: string;
}

interface ExpensesByCategory {
	id: number | null;
	name: string;
	total_expense: number;
}

interface MonthlyData {
	expenses: number;
	income: number;
	revenue: number;
}

interface MonthlyComparisonData {
	current: MonthlyData;
	previous: MonthlyData;
	changes: {
		expenses: number;
		income: number;
		revenue: number;
	};
}

interface Income {
	id: number;
	name: string;
	amount: string;
	date: string;
}

function DashboardPage() {
	const [totalExpense, setTotalExpense] = useState<number>(0);
	const [thisMonthExpense, setThisMonthExpense] = useState<number>(0);
	const [thisMonthIncome, setThisMonthIncome] = useState<number>(0);
	const [thisMonthRevenue, setThisMonthRevenue] = useState<number>(0);
	const [expensesByCategories, setExpensesByCategories] = useState<
		ExpensesByCategory[]
	>([]);
	const [comparisonData, setComparisonData] =
		useState<MonthlyComparisonData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);
	const today = new Date();
	const month = today.getMonth() + 1;

	useEffect(() => {
		const fetchExpense = async () => {
			setLoading(true);
			try {
				const response = await apiClient.get('/expenses');
				const expenses = response.data.data;
				setTotalExpense(
					expenses.reduce(
						(sum: number, expense: Expense) =>
							sum + parseFloat(expense.amount),
						0
					)
				);

				setThisMonthExpense(
					expenses.reduce((sum: number, expense: Expense) => {
						const expenseDate = new Date(expense.date);
						const expenseMonth = expenseDate.getMonth() + 1;
						return expenseMonth === month
							? sum + parseFloat(expense.amount)
							: sum;
					}, 0)
				);
			} catch (err) {
				console.error(err as Error);
			} finally {
				setLoading(false);
			}
		};
		const fetchIncome = async () => {
			setLoading(true);
			try {
				const response = await apiClient.get('/incomes');
				const incomes = response.data.data;
				setThisMonthIncome(
					incomes.reduce((sum: number, income: Income) => {
						const incomeDate = new Date(income.date);
						const incomeMonth = incomeDate.getMonth() + 1;
						return incomeMonth === month
							? sum + parseFloat(income.amount)
							: sum;
					}, 0)
				);
			} catch (err) {
				console.error(err as Error);
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		const fetchExpensesByCategories = async () => {
			setLoading(true);
			try {
				const response = await apiClient.get('/expenses-by-category');
				setExpensesByCategories(response.data.data);
			} catch (err) {
				console.error(err);
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		const fetchMonthlyComparison = async () => {
			setLoading(true);
			try {
				const response = await apiClient.get('/monthly-comparison');
				setComparisonData(response.data.data);
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchExpense();
		fetchIncome();
		fetchExpensesByCategories();
		fetchMonthlyComparison();
	}, [month]);

	useEffect(() => {
		setThisMonthRevenue((thisMonthIncome || 0) - (thisMonthExpense || 0));
	}, [thisMonthExpense, thisMonthIncome]);

	const generateColorPalette = (count: number) => {
		const colors = [];
		for (let i = 0; i < count; i++) {
			const color = `hsl(${(i * 360) / count}, 70%, 60%)`; // Generate colors with varying hues
			colors.push(color);
		}
		return colors;
	};

	return (
		<div className='flex flex-col gap-8'>
			<h2 className='text-2xl font-bold'>Dashboard</h2>
			{error && (
				<div className='text-foreground bg-danger p-4 rounded-md mb-4'>
					{error.message}
				</div>
			)}
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

			{!loading && (
				<div className='flex flex-col gap-8'>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-2'>
							<DashboardCard
								title='Total Expense'
								value={`Rp ${totalExpense}`}
								icon={
									<FontAwesomeIcon icon={faMoneyBillWave} />
								}
							/>
							<DashboardCard
								title="This Month's Expense"
								value={`Rp ${thisMonthExpense}`}
								icon={<FontAwesomeIcon icon={faArrowDown} />}
							/>
							<DashboardCard
								title="This Month's Income"
								value={`Rp ${thisMonthIncome}`}
								icon={<FontAwesomeIcon icon={faArrowUp} />}
							/>
							<DashboardCard
								title="This Month's Revenue"
								value={`Rp ${thisMonthRevenue}`}
								icon={<FontAwesomeIcon icon={faChartPie} />}
							/>
						</div>
						<div className='flex justify-center items-center'>
							<div className='w-full h-52 l:h-80'>
								<Doughnut
									data={{
										labels: expensesByCategories.map(
											cat => cat.name
										),
										datasets: [
											{
												label: 'Expenses by Category',
												data: expensesByCategories.map(
													cat => cat.total_expense
												),
												backgroundColor:
													generateColorPalette(
														expensesByCategories.length
													),
												borderWidth: 0,
											},
										],
									}}
									options={{
										plugins: {
											legend: {
												position: 'top',
											},
											tooltip: {
												enabled: true,
											},
										},
										responsive: true,
										maintainAspectRatio: false,
									}}
								/>
							</div>
						</div>
					</div>
					<div className='flex flex-col gap-4 w-full col-span-3'>
						<h2 className='font-bold text-2xl my-4'>
							Monthly Report
						</h2>
						<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
							<div className='p-4 bg-secondary rounded-lg'>
								<h3 className='text-xl font-bold'>Expenses</h3>
								<p>
									Current Month: Rp
									{comparisonData?.current.expenses.toLocaleString() ||
										0}
								</p>
								<p>
									Previous Month: Rp
									{comparisonData?.previous.expenses.toLocaleString() ||
										0}
								</p>
								<p
									className={`text-${
										(comparisonData?.changes.expenses ||
											0) >= 0
											? 'green'
											: 'red'
									}-500`}>
									Change:{' '}
									{(comparisonData?.changes.expenses || 0) > 0
										? `+${
												comparisonData?.changes
													.expenses || 0
										  }`
										: comparisonData?.changes.expenses || 0}
									%
								</p>
							</div>
							<div className='p-4 bg-secondary rounded-lg'>
								<h3 className='text-xl font-bold'>Income</h3>
								<p>
									Current Month: Rp
									{comparisonData?.current.income.toLocaleString() ||
										0}
								</p>
								<p>
									Previous Month: Rp
									{comparisonData?.previous.income.toLocaleString() ||
										0}
								</p>
								<p
									className={`text-${
										(comparisonData?.changes.income || 0) >=
										0
											? 'green'
											: 'red'
									}-500`}>
									Change:{' '}
									{(comparisonData?.changes.income || 0) > 0
										? `+${
												comparisonData?.changes
													.income || 0
										  }`
										: comparisonData?.changes.income || 0}
									%
								</p>
							</div>
							<div className='p-4 bg-secondary rounded-lg'>
								<h3 className='text-xl font-bold'>Revenue</h3>
								<p>
									Current Month: Rp
									{comparisonData?.current.revenue.toLocaleString() ||
										0}
								</p>
								<p>
									Previous Month: Rp
									{comparisonData?.previous.revenue.toLocaleString() ||
										0}
								</p>
								<p
									className={`text-${
										(comparisonData?.changes.revenue ||
											0) >= 0
											? 'green'
											: 'red'
									}-500`}>
									Change:{' '}
									{(comparisonData?.changes.revenue || 0) > 0
										? `+${
												comparisonData?.changes
													.revenue || 0
										  }`
										: comparisonData?.changes.revenue || 0}
									%
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default withAuth(DashboardPage);
