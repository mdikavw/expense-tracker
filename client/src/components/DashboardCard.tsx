interface CardProps {
	title: string;
	value: string | number;
	icon?: JSX.Element;
}

const DashboardCard: React.FC<CardProps> = ({ title, value, icon }) => (
	<div className='flex items-center gap-8 bg-secondary rounded-lg px-4 py-6 w-full'>
		{icon && <div className='text-2xl'>{icon}</div>}
		<div className='flex flex-col gap-2'>
			<p className='text-3xl font-bold'>{value}</p>
			<h3 className='text-xs'>{title}</h3>
		</div>
	</div>
);

export default DashboardCard;
