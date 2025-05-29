
import { 
  Users, 
  FileText, 
  CheckCircle, 
  MessageSquare 
} from 'lucide-react';

const StatisticsSection = () => {
  const stats = [
    {
      icon: <FileText className="h-8 w-8 text-scheme-primary" />,
      value: "500+",
      label: "Schemes Available",
      description: "Government schemes across various categories"
    },
    {
      icon: <Users className="h-8 w-8 text-scheme-primary" />,
      value: "2M+",
      label: "Registered Users",
      description: "Citizens using our platform nationwide"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-scheme-primary" />,
      value: "800K+",
      label: "Successful Applications",
      description: "Citizens benefiting from schemes"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-scheme-primary" />,
      value: "24/7",
      label: "Support Available",
      description: "Assistance in multiple languages"
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 border border-gray-100 rounded-lg shadow-sm">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-50 rounded-full mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="font-semibold text-gray-700 mb-1">{stat.label}</p>
              <p className="text-sm text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
