import exp from "constants";

interface CardDashboardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const CardDashboard = ({ title, value, icon }: CardDashboardProps) => {
  return (
    <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-900">
      <div className="px-4 py-5 sm:p-6">
        <dl>
          <dt className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
            <div className="flex flex-row gap-2">
              {icon}
              <h1 className="text-xl">{title}</h1>
            </div>
          </dt>
          <dd className="m-4 float-end text-3xl leading-9 font-semibold text-indigo-600 dark:text-indigo-400">
            {value}
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default CardDashboard;
