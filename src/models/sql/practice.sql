-- Practice database tables for assignments
-- This file accumulates changes from multiple assignments
-- Add new tables and modifications here as you work through the course

-- Contact form table
CREATE TABLE IF NOT EXISTS contact_form (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE contact_form
ADD COLUMN IF NOT EXISTS name VARCHAR(100);

ALTER TABLE contact_form
ADD COLUMN IF NOT EXISTS email VARCHAR(100);

-- Users table for registration system
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);