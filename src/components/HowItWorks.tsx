import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { UserPlus, Search, ClipboardCheck, Bell } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus size={40} className="text-scheme-primary" />,
      title: "Create Your Profile",
      description: "Register and complete your profile with personal information to get personalized scheme recommendations."
    },
    {
      icon: <Search size={40} className="text-scheme-primary" />,
      title: "Discover Schemes",
      description: "Browse or search through our comprehensive database of government schemes and benefits."
    },
    {
      icon: <ClipboardCheck size={40} className="text-scheme-primary" />,
      title: "Check Eligibility & Apply",
      description: "Review the eligibility criteria and apply directly through our guided application process."
    },
    {
      icon: <Bell size={40} className="text-scheme-primary" />,
      title: "Track & Get Updates",
      description: "Receive notifications about your application status and upcoming scheme deadlines."
    }
  ];

  return (
    <div className="py-16 bg-gray-50 border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to find and apply for government schemes that match your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                {step.icon}
              </div>
              <div className="absolute -mt-10 ml-20 w-8 h-8 bg-scheme-secondary text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-scheme-secondary hover:bg-scheme-secondary/90">
            <Link to="/scheme-matcher">
              Get Started Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
