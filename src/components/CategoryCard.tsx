
import { Link } from 'react-router-dom';
import { 
  Leaf, BookOpen, Heart, BadgeDollarSign, Home, Users,
  Briefcase, Baby, GraduationCap, Smartphone, Building2, Award,
  Zap, Atom, Trees, Droplets, Scale, Palette, Medal, Mountain,
  Accessibility, IndianRupee, Globe, BarChart, LucideIcon, Map, School,
  CircleDollarSign, FlaskConical, BrainCircuit, HeartPulse, Bus, Bird, Landmark,
  FileText, LineChart, Network, Coffee, Tractor, Umbrella, BatteryCharging
} from 'lucide-react';

export interface CategoryProps {
  id: string;
  title: string;
  count: number;
  icon: string;
}

const CategoryCard = ({ id, title, count, icon }: CategoryProps) => {
  // Map icon string to Lucide icon component
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      agriculture: <Leaf className="h-6 w-6" />,
      education: <BookOpen className="h-6 w-6" />,
      health: <Heart className="h-6 w-6" />,
      finance: <BadgeDollarSign className="h-6 w-6" />,
      housing: <Home className="h-6 w-6" />,
      social: <Users className="h-6 w-6" />,
      employment: <Briefcase className="h-6 w-6" />,
      children: <Baby className="h-6 w-6" />,
      scholarship: <GraduationCap className="h-6 w-6" />,
      digital: <Smartphone className="h-6 w-6" />,
      industry: <Building2 className="h-6 w-6" />,
      skills: <Award className="h-6 w-6" />,
      zap: <Zap className="h-6 w-6" />,
      atom: <Atom className="h-6 w-6" />,
      tree: <Trees className="h-6 w-6" />,
      droplets: <Droplets className="h-6 w-6" />,
      scale: <Scale className="h-6 w-6" />,
      palette: <Palette className="h-6 w-6" />,
      medal: <Medal className="h-6 w-6" />,
      mountain: <Mountain className="h-6 w-6" />,
      accessibility: <Accessibility className="h-6 w-6" />,
      rural: <Tractor className="h-6 w-6" />,
      power: <BatteryCharging className="h-6 w-6" />,
      tribal: <Bird className="h-6 w-6" />,
      science: <FlaskConical className="h-6 w-6" />,
      environment: <Globe className="h-6 w-6" />,
      water: <Droplets className="h-6 w-6" />,
      legal: <Scale className="h-6 w-6" />,
      art: <Palette className="h-6 w-6" />,
      sports: <Medal className="h-6 w-6" />,
      tourism: <Mountain className="h-6 w-6" />,
      urban: <Building2 className="h-6 w-6" />,
      disability: <Accessibility className="h-6 w-6" />,
      women: <Users className="h-6 w-6" />,
      startup: <BarChart className="h-6 w-6" />,
      scheme: <FileText className="h-6 w-6" />,
      bank: <IndianRupee className="h-6 w-6" />,
      pension: <CircleDollarSign className="h-6 w-6" />,
      transport: <Bus className="h-6 w-6" />,
      telecom: <Network className="h-6 w-6" />,
      food: <Coffee className="h-6 w-6" />,
      insurance: <Umbrella className="h-6 w-6" />,
      railway: <Map className="h-6 w-6" />,
      sme: <LineChart className="h-6 w-6" />,
      heritage: <Landmark className="h-6 w-6" />,
      medical: <HeartPulse className="h-6 w-6" />,
      ai: <BrainCircuit className="h-6 w-6" />,
      education2: <School className="h-6 w-6" />
    };
    
    return iconMap[iconName] || <FileText className="h-6 w-6" />;
  };

  return (
    <Link to={`/categories/${id}`} className="block">
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100 group h-full category-card">
        <div className="mb-2 sm:mb-4 inline-flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-scheme-primary/10 text-scheme-primary group-hover:bg-scheme-primary group-hover:text-white transition-all duration-300">
          {getIcon(icon)}
        </div>
        <h3 className="text-xs sm:text-lg font-semibold mb-1 group-hover:text-scheme-primary transition-colors line-clamp-2">{title}</h3>
        <p className="text-gray-500 text-xs sm:text-sm">{count} schemes</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
