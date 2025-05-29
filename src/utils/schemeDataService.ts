import { SchemeProps } from "@/components/SchemeCard";
import { getSupabaseClient, isSupabaseConnected } from "./supabaseClient";

// Define a function to get featured schemes
export const getFeaturedSchemes = async (): Promise<SchemeProps[]> => {
  if (isSupabaseConnected()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('schemes')
          .select('*')
          .eq('is_popular', true)
          .limit(6);
        
        if (error) {
          console.error('Error fetching featured schemes:', error);
          return fallbackSchemes.filter(scheme => scheme.isPopular);
        }
        
        return data.map(mapSchemeFromSupabase);
      } catch (err) {
        console.error('Failed to fetch featured schemes:', err);
        return fallbackSchemes.filter(scheme => scheme.isPopular);
      }
    }
  }
  
  // Fallback to mock data if not connected to Supabase
  return fallbackSchemes.filter(scheme => scheme.isPopular);
};

// Define a function to get all schemes
export const getAllSchemes = async (): Promise<SchemeProps[]> => {
  console.log("Fetching all schemes");
  if (isSupabaseConnected()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        console.log("Supabase connected, fetching schemes");
        const { data, error } = await supabase
          .from('schemes')
          .select('*')
          .limit(100); // Limit to prevent loading too many at once
        
        if (error) {
          console.error('Error fetching all schemes:', error);
          return fallbackSchemes;
        }
        
        console.log(`Fetched ${data?.length || 0} schemes from Supabase`);
        return data.map(mapSchemeFromSupabase);
      } catch (err) {
        console.error('Failed to fetch all schemes:', err);
        return fallbackSchemes;
      }
    }
  }
  
  console.log("Using fallback schemes");
  // Fallback to mock data if not connected to Supabase
  return fallbackSchemes;
};

// Define a function to get a scheme by ID
export const getSchemeById = async (id: string): Promise<SchemeProps | undefined> => {
  if (isSupabaseConnected()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('schemes')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error(`Error fetching scheme with ID ${id}:`, error);
          return fallbackSchemes.find(scheme => scheme.id === id);
        }
        
        return mapSchemeFromSupabase(data);
      } catch (err) {
        console.error(`Failed to fetch scheme with ID ${id}:`, err);
        return fallbackSchemes.find(scheme => scheme.id === id);
      }
    }
  }
  
  // Fallback to mock data if not connected to Supabase
  return fallbackSchemes.find(scheme => scheme.id === id);
};

// Function to get schemes for a specific category
export const getSchemesForCategory = async (categoryId: string): Promise<SchemeProps[]> => {
  console.log(`Fetching schemes for category: ${categoryId}`);
  if (isSupabaseConnected()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('schemes')
          .select('*')
          .eq('category_id', categoryId);
        
        if (error) {
          console.error(`Error fetching schemes for category ${categoryId}:`, error);
          return fallbackSchemes.filter(scheme => 
            scheme.category.toLowerCase() === categoryId.toLowerCase()
          );
        }
        
        console.log(`Fetched ${data?.length || 0} schemes for category ${categoryId}`);
        return data.map(mapSchemeFromSupabase);
      } catch (err) {
        console.error(`Failed to fetch schemes for category ${categoryId}:`, err);
        return fallbackSchemes.filter(scheme => 
          scheme.category.toLowerCase() === categoryId.toLowerCase()
        );
      }
    }
  }
  
  console.log(`Using fallback schemes for category: ${categoryId}`);
  // Fallback to mock data if not connected to Supabase
  return fallbackSchemes.filter(scheme => 
    scheme.category.toLowerCase() === categoryId.toLowerCase()
  );
};

// Define a function to search schemes
export const searchSchemes = async (
  query: string, 
  filters: { 
    category?: string; 
    state?: string; 
    isActive?: boolean 
  } = {}
): Promise<SchemeProps[]> => {
  if (isSupabaseConnected()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let supabaseQuery = supabase.from('schemes').select('*');
        
        // Add search query
        if (query.trim()) {
          supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,ministry.ilike.%${query}%,category.ilike.%${query}%`);
        }
        
        // Add filters
        if (filters.category && filters.category !== 'all') {
          supabaseQuery = supabaseQuery.eq('category_id', filters.category);
        }
        
        if (filters.state && filters.state !== 'all') {
          supabaseQuery = supabaseQuery.eq('state', filters.state);
        }
        
        if (filters.isActive !== undefined) {
          if (filters.isActive) {
            supabaseQuery = supabaseQuery.not('deadline', 'eq', 'Closed');
          } else {
            supabaseQuery = supabaseQuery.eq('deadline', 'Closed');
          }
        }
        
        const { data, error } = await supabaseQuery;
        
        if (error) {
          console.error('Error searching schemes:', error);
          return filterFallbackSchemes(query, filters);
        }
        
        return data.map(mapSchemeFromSupabase);
      } catch (err) {
        console.error('Failed to search schemes:', err);
        return filterFallbackSchemes(query, filters);
      }
    }
  }
  
  // Fallback to mock data if not connected to Supabase
  return filterFallbackSchemes(query, filters);
};

// Function to submit a scheme application
export const submitSchemeApplication = async (applicationData: any): Promise<{ success: boolean, applicationId?: string, error?: string }> => {
  if (isSupabaseConnected()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        // Add timestamp to application data
        const dataWithTimestamp = {
          ...applicationData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const { data, error } = await supabase
          .from('scheme_applications')
          .insert([dataWithTimestamp])
          .select();
        
        if (error) {
          console.error('Error submitting application:', error);
          return { success: false, error: error.message };
        }
        
        return { success: true, applicationId: data[0].id };
      } catch (err: any) {
        console.error('Failed to submit application:', err);
        return { success: false, error: err.message || 'An unexpected error occurred' };
      }
    }
  }
  
  // Simulate successful submission when offline
  console.log('Using fallback for scheme application submission');
  return { success: true, applicationId: `APP${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}` };
};

// Function to upload a document for an application
export const uploadApplicationDocument = async (file: File, applicationId: string, documentType: string): Promise<{ success: boolean, url?: string, error?: string }> => {
  if (isSupabaseConnected()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${applicationId}/${documentType}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data, error } = await supabase
          .storage
          .from('application-documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Error uploading document:', error);
          return { success: false, error: error.message };
        }
        
        const { data: publicUrl } = supabase
          .storage
          .from('application-documents')
          .getPublicUrl(data.path);
        
        return { success: true, url: publicUrl.publicUrl };
      } catch (err: any) {
        console.error('Failed to upload document:', err);
        return { success: false, error: err.message || 'An unexpected error occurred' };
      }
    }
  }
  
  // Simulate successful upload when offline
  console.log('Using fallback for document upload');
  return { success: true, url: `https://example.com/documents/${applicationId}/${documentType}` };
};

// Helper to filter fallback schemes
const filterFallbackSchemes = (
  query: string, 
  filters: { 
    category?: string; 
    state?: string; 
    isActive?: boolean 
  }
): SchemeProps[] => {
  let results = fallbackSchemes;

  if (query.trim()) {
    query = query.toLowerCase();
    results = results.filter(
      scheme =>
        scheme.title.toLowerCase().includes(query) ||
        scheme.description.toLowerCase().includes(query) ||
        scheme.ministry?.toLowerCase().includes(query) ||
        scheme.category.toLowerCase().includes(query)
    );
  }

  if (filters.category && filters.category !== 'all') {
    results = results.filter(scheme => 
      scheme.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  if (filters.state && filters.state !== 'all') {
    results = results.filter(scheme => 
      scheme.state?.toLowerCase() === filters.state.toLowerCase()
    );
  }

  if (filters.isActive !== undefined) {
    results = results.filter(scheme => {
      const isActive = scheme.deadline && scheme.deadline !== 'Closed';
      return filters.isActive ? isActive : !isActive;
    });
  }

  return results;
};

// Helper function to map Supabase scheme records to SchemeProps
const mapSchemeFromSupabase = (record: any): SchemeProps => {
  return {
    id: record.id || record.scheme_id || '',
    title: record.title || '',
    description: record.description || '',
    category: record.category || '',
    ministry: record.ministry || record.funding_ministry || '',
    deadline: record.deadline || '',
    eligibility: record.eligibility_text || record.eligibility || "Check eligibility criteria",
    eligibilityText: record.eligibility_text || '',
    launchDate: record.launch_date || '',
    isPopular: record.is_popular || false,
    benefitAmount: record.benefit_amount || '',
    documents: record.documents || [],
    tags: record.tags || [],
    applicationUrl: record.application_url || '',
    schemeCode: record.scheme_code || '',
    fundingMinistry: record.funding_ministry || '',
    state: record.state || '',
    implementingAgency: record.implementing_agency || '',
    beneficiaries: record.beneficiaries || '',
    objective: record.objective || ''
  };
};

// Update the fallback schemes to include Karnataka schemes
import karnatakaSchemes from '@/data/karnatakaSchemes';

// Update the fallback schemes with more data from myscheme.gov.in
const fallbackSchemes: SchemeProps[] = [
  {
    id: "pm-kisan",
    title: "PM-KISAN",
    description: "Pradhan Mantri Kisan Samman Nidhi is a Central Sector scheme with 100% funding from Government of India. Under the Scheme, income support of ₹6,000 per year is provided to all farmer families across the country in three equal installments of ₹2,000 each every four months.",
    category: "Agriculture & Farming",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    deadline: "Ongoing",
    eligibility: "Small and Marginal Farmers across India with cultivable landholding.",
    eligibilityText: "All landholding farmers' families, which have cultivable land as per land records.",
    launchDate: "February 24, 2019",
    isPopular: true,
    benefitAmount: "₹6,000 per year",
    documents: [
      "Aadhaar Card",
      "Land Records",
      "Bank Account Details",
      "Passport Size Photo"
    ],
    tags: ["farmers", "income support"],
    applicationUrl: "https://pmkisan.gov.in/"
  },
  {
    id: "pmjay",
    title: "Ayushman Bharat - PMJAY",
    description: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY) is a National Health Insurance Scheme which provides coverage of up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
    category: "Health",
    ministry: "Ministry of Health & Family Welfare",
    deadline: "Ongoing",
    eligibility: "Economically disadvantaged families identified based on SECC database.",
    eligibilityText: "Families identified based on deprivation criteria in the SECC database.",
    launchDate: "September 23, 2018",
    isPopular: true,
    benefitAmount: "Up to ₹5 lakh per family per year",
    documents: [
      "Aadhaar Card",
      "Ration Card",
      "SECC Database Record"
    ],
    tags: ["health insurance", "medical"],
    applicationUrl: "https://pmjay.gov.in/"
  },
  {
    id: "pmuy",
    title: "Pradhan Mantri Ujjwala Yojana",
    description: "PMUY aims to safeguard the health of women & children by providing them with clean cooking fuel – LPG, so that they don't have to compromise their health in smoky kitchens or wander in unsafe areas collecting firewood.",
    category: "Energy & Environment",
    ministry: "Ministry of Petroleum and Natural Gas",
    deadline: "Ongoing",
    eligibility: "Women from BPL households.",
    eligibilityText: "Women belonging to Below Poverty Line (BPL) families.",
    launchDate: "May 1, 2016",
    isPopular: true,
    benefitAmount: "Free LPG connection with financial assistance",
    documents: [
      "Aadhaar Card",
      "BPL Ration Card",
      "Bank Account Details"
    ],
    tags: ["clean cooking", "women welfare"],
    applicationUrl: "https://pmuy.gov.in/"
  },
  {
    id: "pmay-u",
    title: "Pradhan Mantri Awas Yojana - Urban",
    description: "PMAY-U aims to provide housing for all in urban areas by 2022. The scheme provides central assistance to Urban Local Bodies and other implementing agencies through States/UTs for in-situ Rehabilitation of existing slum dwellers.",
    category: "Housing",
    ministry: "Ministry of Housing and Urban Affairs",
    deadline: "2024-12-31",
    eligibility: "Urban residents belonging to EWS/LIG/MIG categories",
    eligibilityText: "Urban residents with annual income up to ₹18 lakh",
    launchDate: "June 25, 2015",
    isPopular: true,
    benefitAmount: "Up to ₹2.67 lakh subsidy",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Income Certificate",
      "Property Documents"
    ],
    tags: ["housing", "urban development"],
    applicationUrl: "https://pmaymis.gov.in/"
  },
  {
    id: "skill-india",
    title: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
    description: "PMKVY is the flagship scheme of the Ministry of Skill Development & Entrepreneurship implemented by National Skill Development Corporation. The objective is to enable Indian youth to take up industry-relevant skill training.",
    category: "Skill Development",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    deadline: "Ongoing",
    eligibility: "Indian citizens between 15-45 years",
    eligibilityText: "Indian youth looking for skill certification",
    launchDate: "July 15, 2015",
    isPopular: true,
    benefitAmount: "Free training and certification",
    documents: [
      "Aadhaar Card",
      "Education Certificates",
      "Bank Account Details"
    ],
    tags: ["skill development", "employment"],
    applicationUrl: "https://pmkvyofficial.org/"
  },
  {
    id: "mudra-yojana",
    title: "Pradhan Mantri Mudra Yojana",
    description: "PMMY provides loans up to 10 lakh to the non-corporate, non-farm small/micro enterprises through various financial institutions.",
    category: "Finance",
    ministry: "Ministry of Finance",
    deadline: "Ongoing",
    eligibility: "Small business owners and entrepreneurs",
    eligibilityText: "Non-corporate small business owners",
    launchDate: "April 8, 2015",
    isPopular: true,
    benefitAmount: "Loans up to ₹10 lakh",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Business Plan",
      "Bank Statements"
    ],
    tags: ["finance", "business loans"],
    applicationUrl: "https://www.mudra.org.in/"
  },
  {
    id: "pmjdy",
    title: "Pradhan Mantri Jan Dhan Yojana",
    description: "Financial inclusion program ensuring access to financial services like banking, savings & deposit accounts, remittance, credit, insurance, pension.",
    category: "Finance",
    ministry: "Ministry of Finance",
    deadline: "Ongoing",
    eligibility: "Any Indian citizen above 10 years of age",
    eligibilityText: "All Indian citizens without a bank account",
    launchDate: "August 28, 2014",
    isPopular: true,
    benefitAmount: "Free zero-balance account with insurance",
    documents: [
      "Aadhaar Card",
      "Address Proof",
      "Passport Size Photo"
    ],
    tags: ["banking", "financial inclusion"],
    applicationUrl: "https://pmjdy.gov.in/"
  },
  {
    id: "pmfby",
    title: "Pradhan Mantri Fasal Bima Yojana",
    description: "Comprehensive crop insurance scheme to protect farmers from crop loss/damage due to unforeseen events.",
    category: "Agriculture & Farming",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    deadline: "Seasonal",
    eligibility: "All farmers including sharecroppers and tenant farmers",
    eligibilityText: "Farmers growing notified crops in notified areas",
    launchDate: "February 18, 2016",
    isPopular: true,
    benefitAmount: "Variable based on crop loss",
    documents: [
      "Land Records",
      "Bank Account Details",
      "Aadhaar Card"
    ],
    tags: ["agriculture", "insurance"],
    applicationUrl: "https://pmfby.gov.in/"
  },
  
  // Add Karnataka schemes to fallback
  ...karnatakaSchemes
];

export default fallbackSchemes;
