/*
  # Resume Analysis Platform Schema

  ## Overview
  Creates the database schema for a resume analysis platform with user profiles and analysis results storage.

  ## Tables Created

  ### 1. user_profiles
  Stores user account information and profile details.
  - `id` (uuid, primary key) - References auth.users, unique identifier for each user
  - `email` (text, unique, not null) - User's email address
  - `full_name` (text, not null) - User's full name
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. analysis_results
  Stores resume analysis results for both individual and group analyses.
  - `id` (uuid, primary key) - Unique identifier for each analysis
  - `user_id` (uuid, foreign key) - References user who performed the analysis
  - `analysis_type` (text) - Type of analysis: 'individual' or 'group'
  - `job_role` (text) - Job role being analyzed for
  - `job_description` (text) - Job description used in analysis
  - `resume_filename` (text) - Original filename of the resume
  - `resume_text` (text) - Extracted text from resume
  - `resume_skills` (text[]) - Array of skills found in resume
  - `job_skills_required` (text[]) - Array of skills required for the job
  - `missing_skills` (text[]) - Array of skills missing from resume
  - `match_percent` (integer) - Match percentage score
  - `verdict` (text) - Analysis verdict: 'Suitable' or 'Not Suitable'
  - `created_at` (timestamptz) - Analysis timestamp

  ## Security

  ### Row Level Security (RLS)
  - Both tables have RLS enabled
  - Users can only access their own data
  - All policies require authentication
  - Policies enforce user ownership via auth.uid()

  ### Policies Created

  #### user_profiles table:
  1. Users can view their own profile
  2. Users can insert their own profile (during signup)
  3. Users can update their own profile
  4. Users can delete their own profile

  #### analysis_results table:
  1. Users can view their own analysis results
  2. Users can insert their own analysis results
  3. Users can update their own analysis results
  4. Users can delete their own analysis results

  ## Notes
  - All operations use `IF EXISTS` / `IF NOT EXISTS` for safe migrations
  - Timestamps default to current time
  - Foreign key constraints ensure data integrity
  - Indexes added for common query patterns
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  analysis_type text NOT NULL CHECK (analysis_type IN ('individual', 'group')),
  job_role text NOT NULL,
  job_description text DEFAULT '',
  resume_filename text NOT NULL,
  resume_text text NOT NULL,
  resume_skills text[] DEFAULT '{}',
  job_skills_required text[] DEFAULT '{}',
  missing_skills text[] DEFAULT '{}',
  match_percent integer NOT NULL CHECK (match_percent >= 0 AND match_percent <= 100),
  verdict text NOT NULL CHECK (verdict IN ('Suitable', 'Not Suitable')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own analysis results"
  ON analysis_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis results"
  ON analysis_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analysis results"
  ON analysis_results FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analysis results"
  ON analysis_results FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at DESC);
