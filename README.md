# LawBanditSyllabus

A Node.js/Express backend for extracting, storing, and managing law school syllabus assignments using AI and PDF parsing.

## Features

- **PDF Syllabus Extraction**: Upload a syllabus PDF and extract all assignments and deadlines using AI (Groq Llama-3 model).
- **Assignment Management**: CRUD operations for assignments and syllabi via REST API.
- **Supabase Integration**: Stores syllabi and assignments in a Supabase PostgreSQL database.
- **Date Inference**: AI infers missing assignment dates based on class schedule and context.
- **CORS Support**: Ready for frontend integration.
- **TypeScript**: Fully typed for safety and maintainability.

## Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm
- Supabase project (for database)
- Groq API key (for AI extraction)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/JaredKyleLeonano/LawBanditSyllabus.git
   cd LawBanditSyllabus
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in your `GROQ_API_KEY` and Supabase credentials.

4. **Build the project:**
   ```sh
   npm run build
   ```
5. **Start the server:**
   ```sh
   npm start
   ```
   Or for development with hot reload:
   ```sh
   npm run dev
   ```

## API Documentation

### POST `/uploadSyllabus`

- Upload a PDF syllabus file (multipart/form-data, field: `pdf`).
- Extracts assignments and stores them in the database.
- Returns the extracted syllabus and assignments.

### GET `/getAssignments`

- Returns all assignments from the database.

### GET `/getSyllabi`

- Returns all syllabi from the database.

### PUT `/updateAssignment/:event_id`

- Update an assignment by its ID.

### DELETE `/deleteAssignment/:event_id`

- Delete an assignment by its ID.

### PUT `/updateSyllabus/:syllabus_id`

- Update a syllabus title by its ID.

### DELETE `/deleteSyllabus/:syllabus_id`

- Delete a syllabus by its ID.

## Project Structure

```
LawBanditSyllabus/
├── src/
│   ├── ai/
│   │   └── aiClient.ts     # AI extraction logic (Groq integration)
│   ├── api/
│   │   └── index.ts        # Setup for express server and API routes
│   ├── routes/             # Contains all of the routes for the various API calls
│   ├── queries/            # Contains all of the queries used to communicate with either supabase or google
├── patches/                # Patch files for dependencies
├── supabase.ts/            # Creation of supabase client for database calls
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

Create a `.env` file in the root directory with the following:

```
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```
