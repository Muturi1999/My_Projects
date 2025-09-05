import { BookOpen, Users, Layers, ShoppingBag } from 'lucide-react';

const stats = [
  { label: 'Books Available', value: '2,450', icon: BookOpen },
  { label: 'Categories', value: '32', icon: Layers },
  { label: 'Active Users', value: '1,290', icon: Users },
  { label: 'Orders Completed', value: '3,804', icon: ShoppingBag },
];

export default function StatsBanner() {
  return (
    <div className="bg-blue-50 py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
              <div className="flex justify-center mb-2 text-blue-600">
                <Icon size={28} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
