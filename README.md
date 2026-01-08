# JASIQ Labs Website - Phase 0 Foundation

This is the Phase 0 foundation setup for the JASIQ Labs website rebuild. This phase focuses on structure, logic, APIs, and SEO systems - **NO UI DESIGN yet**.

## Tech Stack

- **Frontend**: React (Vite) + TailwindCSS + Axios + JavaScript (.jsx)
- **Backend**: Node.js + Express + MongoDB (Mongoose) + JavaScript (.js)
- **Architecture**: Separated frontend and backend folders

## Project Structure

```
jasiqlabs-website/
├── frontend/                 # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── app/             # Routing logic
│   │   ├── components/      # Shared components (minimal)
│   │   ├── services/        # API service layer (Axios)
│   │   ├── seo/             # SEO builder utility
│   │   ├── analytics/       # Analytics wrapper
│   │   ├── config/          # Environment variables
│   │   └── main.jsx
│   └── package.json
│
├── backend/                 # Node + Express API
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── db/              # Mongoose connection & models
│   │   ├── middlewares/
│   │   └── utils/
│   └── package.json
│
└── docs/                    # Documentation
    ├── CONTENT_OWNERSHIP.md
    └── PHASE_0.md
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jasiqlabs
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

5. Seed the database:
   ```bash
   npm run seed
   ```

6. Start the server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your configuration:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   VITE_SITE_URL=http://localhost:5173
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Public Endpoints

- `GET /api/public/seo/defaults` - Get global SEO settings
- `GET /api/public/pages/:slug/seo` - Get page-specific SEO
- `POST /api/public/leads` - Submit a lead form
- `GET /robots.txt` - Dynamic robots.txt
- `GET /sitemap.xml` - Dynamic sitemap.xml

### Example API Calls

```bash
# Get SEO defaults
curl http://localhost:5000/api/public/seo/defaults

# Get page SEO
curl http://localhost:5000/api/public/pages//seo

# Submit a lead
curl -X POST http://localhost:5000/api/public/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "interestType": "CLIENT",
    "division": "REALWORK_STUDIO"
  }'
```

## Features Implemented (Phase 0)

### Backend
- ✅ MongoDB connection with Mongoose
- ✅ Database models: SeoSettings, Page, PageSeo, Lead
- ✅ RESTful API endpoints
- ✅ Dynamic robots.txt generation
- ✅ Dynamic sitemap.xml generation
- ✅ Database seed script
- ✅ CORS and security middleware

### Frontend
- ✅ React Router setup with placeholder routes
- ✅ Axios API service layer
- ✅ SEO meta tag builder (react-helmet-async)
- ✅ Analytics event tracking (console logging)
- ✅ TailwindCSS configuration
- ✅ Environment configuration

### Documentation
- ✅ Content ownership matrix
- ✅ Phase 0 verification checklist

## Routes

- `/` - Home page
- `/realworkstudio` - RealWork Studio page
- `/techworksstudio` - TechWorks Studio page
- `/products` - Products page

## Development

### Backend Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed database with mandatory pages

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Phase 0 Rules

- **NO UI DESIGN** - Only structure, logic, APIs, and SEO systems
- All pages are placeholders with minimal content
- Analytics currently console logs only
- Focus on foundation and architecture

## Next Steps

See `docs/PHASE_0.md` for verification checklist and next phase planning.

## License

[To be determined]

