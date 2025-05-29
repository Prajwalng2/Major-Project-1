
import { SchemeProps } from '../components/SchemeCard';
import schemes from './schemes';

// Filter schemes by category
const filterSchemesByCategory = (categoryId: string): SchemeProps[] => {
  return schemes.filter(scheme => scheme.category.toLowerCase() === categoryId.toLowerCase());
};

// Create a map of category IDs to their associated schemes
const categorySchemes: Record<string, SchemeProps[]> = {
  agriculture: filterSchemesByCategory('agriculture'),
  education: filterSchemesByCategory('education'),
  health: filterSchemesByCategory('health'),
  finance: filterSchemesByCategory('finance'),
  housing: filterSchemesByCategory('housing'),
  social: filterSchemesByCategory('social'),
  employment: filterSchemesByCategory('employment'),
  scholarship: filterSchemesByCategory('scholarship'),
  digital: filterSchemesByCategory('digital'),
  skills: filterSchemesByCategory('skills'),
  women: schemes.filter(scheme => 
    (scheme.category.toLowerCase() === 'women') || 
    (scheme.eligibility && 
      typeof scheme.eligibility !== 'string' && 
      scheme.eligibility.gender && 
      scheme.eligibility.gender.includes('female'))
  ),
  infrastructure: filterSchemesByCategory('infrastructure'),
  entrepreneur: filterSchemesByCategory('entrepreneur'),
  power: filterSchemesByCategory('power'),
  water: filterSchemesByCategory('water'),
  food: filterSchemesByCategory('food'),
  tourism: filterSchemesByCategory('tourism'),
};

export default categorySchemes;
