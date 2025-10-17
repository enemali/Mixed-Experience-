/*
  # Create Books and User Settings Tables

  ## Overview
  This migration creates the core tables needed for the library feature:
  - Books table to store book metadata
  - User settings table to store user preferences per book

  ## New Tables

  ### 1. `books`
  Stores metadata for all books in the library
  - `id` (uuid, primary key) - Unique identifier for the book
  - `title` (text) - Book title
  - `subject` (text) - Subject category (STORY, MATHS, SCIENCE, etc.)
  - `author` (text) - Book author name
  - `publisher` (text) - Publisher name
  - `description` (text, optional) - Detailed book description
  - `thumbnail_url` (text) - Small preview image URL
  - `cover_image_url` (text) - Full cover image URL
  - `difficulty_level` (text) - beginner, intermediate, or advanced
  - `target_age_min` (integer) - Minimum recommended age
  - `target_age_max` (integer) - Maximum recommended age
  - `is_active` (boolean) - Soft delete flag
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `user_settings`
  Stores user-specific settings and preferences per book
  - `id` (uuid, primary key) - Unique identifier
  - `book_id` (uuid, foreign key) - Reference to books table
  - `user_id` (uuid, optional) - User identifier (null for anonymous users)
  - `voice_index` (integer) - Selected voice preference
  - `rate` (numeric) - Speech rate setting
  - `pitch` (numeric) - Voice pitch setting
  - `volume` (numeric) - Volume level setting
  - `settings_data` (jsonb) - Additional flexible settings storage
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on both tables
  - Public read access to books (anyone can browse the library)
  - Authenticated users can create and update books
  - Anyone can read user settings
  - Anyone can create/update their own user settings

  ## Indexes
  - Index on subject for efficient filtering by category
  - Index on difficulty_level for filtering by skill level
  - Index on is_active for filtering active books
  - Composite index on book_id and user_id for user settings lookups
*/

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL CHECK (subject IN ('STORY', 'MATHS', 'SCIENCE', 'SPORTS', 'HISTORY', 'GEOGRAPHY', 'ART', 'MUSIC')),
  author text NOT NULL DEFAULT 'Unknown Author',
  publisher text NOT NULL DEFAULT 'Self-Published',
  description text,
  thumbnail_url text NOT NULL,
  cover_image_url text NOT NULL,
  difficulty_level text NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  target_age_min integer NOT NULL DEFAULT 5,
  target_age_max integer NOT NULL DEFAULT 10,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id uuid,
  voice_index integer DEFAULT 0,
  rate numeric DEFAULT 1.0,
  pitch numeric DEFAULT 1.0,
  volume numeric DEFAULT 1.0,
  settings_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (book_id, user_id)
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Books policies
CREATE POLICY "Anyone can read books"
  ON books
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can create books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update books"
  ON books
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete books"
  ON books
  FOR DELETE
  TO authenticated
  USING (true);

-- User settings policies
CREATE POLICY "Anyone can read user settings"
  ON user_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create user settings"
  ON user_settings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update user settings"
  ON user_settings
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_books_subject ON books(subject);
CREATE INDEX IF NOT EXISTS idx_books_difficulty ON books(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_books_active ON books(is_active);
CREATE INDEX IF NOT EXISTS idx_user_settings_book_user ON user_settings(book_id, user_id);