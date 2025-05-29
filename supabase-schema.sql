
-- This is a reference SQL script for setting up the Supabase database schema
-- You would execute these commands in the Supabase SQL editor

-- Create schemes table
CREATE TABLE IF NOT EXISTS schemes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  category_id TEXT,
  ministry TEXT,
  deadline TEXT,
  eligibility_text TEXT,
  eligibility JSONB,
  launch_date TEXT,
  is_popular BOOLEAN DEFAULT false,
  benefit_amount TEXT,
  documents TEXT[],
  tags TEXT[],
  application_url TEXT,
  scheme_code TEXT,
  funding_ministry TEXT,
  state TEXT,
  implementing_agency TEXT,
  beneficiaries TEXT,
  objective TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT,
  count INTEGER DEFAULT 0
);

-- Create scheme applications table
CREATE TABLE IF NOT EXISTS scheme_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id TEXT REFERENCES schemes(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  id_type TEXT NOT NULL,
  id_number TEXT NOT NULL,
  additional_info TEXT,
  status TEXT DEFAULT 'pending',
  documents JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create storage bucket for application documents
-- Note: This needs to be done via the Supabase dashboard or API
-- INSERT INTO storage.buckets (id, name) VALUES ('application-documents', 'Application Documents');

-- To insert sample data, you can use something like:
INSERT INTO schemes (
  id, title, description, category, ministry, deadline, eligibility_text, 
  launch_date, is_popular, benefit_amount, documents, tags
) VALUES 
(
  'pm-kisan', 
  'PM-KISAN', 
  'Pradhan Mantri Kisan Samman Nidhi is a Central Sector scheme with 100% funding from Government of India. Under the Scheme, income support of ₹6,000 per year is provided to all farmer families across the country in three equal installments of ₹2,000 each every four months.', 
  'Agriculture & Farming',
  'Ministry of Agriculture & Farmers Welfare', 
  'Ongoing', 
  'All landholding farmers'' families, which have cultivable land as per land records.',
  'February 24, 2019', 
  TRUE, 
  '₹6,000 per year', 
  ARRAY['Aadhaar Card', 'Land Records', 'Bank Account Details', 'Passport Size Photo'],
  ARRAY['farmers', 'income support']
);

-- Add more sample schemes as needed

-- Add an index for searching
CREATE INDEX IF NOT EXISTS schemes_search_idx ON schemes USING GIN (
  to_tsvector('english', title || ' ' || description || ' ' || ministry || ' ' || category)
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS schemes_category_idx ON schemes (category);
CREATE INDEX IF NOT EXISTS schemes_is_popular_idx ON schemes (is_popular);
CREATE INDEX IF NOT EXISTS schemes_deadline_idx ON schemes (deadline);
CREATE INDEX IF NOT EXISTS scheme_applications_scheme_id_idx ON scheme_applications (scheme_id);
