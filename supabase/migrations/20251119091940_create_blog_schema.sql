/*
  # Blog Application Schema

  ## Overview
  Creates the database schema for a full-stack blog application with authentication and CRUD operations.

  ## New Tables
  
  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `username` (text, unique, required)
  - `email` (text, unique, required)
  - `created_at` (timestamptz, default now())
  - Stores user profile information linked to Supabase auth

  ### `posts`
  - `id` (uuid, primary key, auto-generated)
  - `title` (text, required, 5-120 characters)
  - `image_url` (text, optional, valid URL)
  - `content` (text, required, minimum 50 characters)
  - `user_id` (uuid, references profiles.id)
  - `username` (text, denormalized for performance)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  - Stores blog posts with author information

  ## Security
  
  ### Row Level Security (RLS)
  - RLS enabled on both `profiles` and `posts` tables
  
  ### Profiles Policies
  1. Anyone can view profiles (for displaying author information)
  2. Users can insert their own profile
  3. Users can update only their own profile
  
  ### Posts Policies
  1. Anyone can view all posts (public reading)
  2. Authenticated users can create posts
  3. Users can update only their own posts
  4. Users can delete only their own posts

  ## Indexes
  - Index on posts.user_id for faster author queries
  - Index on posts.title for search functionality
  - Index on posts.created_at for sorting

  ## Functions
  - Trigger to automatically update `updated_at` timestamp on posts
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 120),
  image_url text,
  content text NOT NULL CHECK (char_length(content) >= 50),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  username text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_title ON posts(title);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for posts updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);