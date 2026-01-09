# Phase 1 Implementation - Setup Instructions

## Backend Setup

### 1. Database Migration

After updating the Prisma schema, run the migration:

```bash
cd server
npx prisma migrate dev --name update_lead_schema_phase1
```

This will:
- Update the `Lead` model to match Phase 1 requirements
- Remove the `division`, `message`, and `status` fields
- Change `id` from `cuid()` to `uuid()`
- Simplify `interestType` to a String instead of enum

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Start Backend Server

```bash
npm start
# or for development
npm run dev
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd client
npm install
```

This will install `react-helmet-async` which was added to package.json.

### 2. Environment Variables

Ensure your `.env` file in `client/` has:

```
VITE_API_BASE_URL=http://localhost:8080
```

(Adjust port if your backend runs on a different port)

### 3. Start Frontend Server

```bash
npm run dev
```

## What Was Implemented

### Backend Changes

1. **Prisma Schema Update**
   - Updated `Lead` model to match Phase 1 spec
   - Removed unnecessary fields
   - Simplified to required fields only

2. **Lead Controller**
   - Strict validation (name max 80, email max 120, phone min 7)
   - Validates interestType: ["STUDENT", "CLIENT", "PARTNER"]
   - Validates sourcePage: ["home", "contact"]
   - Returns clear JSON error messages (400 status)

3. **Rate Limiting**
   - In-memory rate limiter (Map-based)
   - Max 20 requests per 10 minutes per IP
   - Applied to POST `/api/public/leads`

4. **Routes**
   - Created separate `/api/public/leads` route
   - Removed leads from publicPages routes

### Frontend Changes

1. **Content Layer**
   - Created `siteContent.json` with all content
   - Acts as CMS for easy content updates

2. **Components**
   - **Layout**: Header, Footer, Layout wrapper
   - **SEO**: Seo component using react-helmet-async
   - **UI**: Button, Field components
   - **Shared**: LeadForm component

3. **Pages**
   - Home page with all sections (hero, what we do, divisions, why, who we work with, trust, lead capture)
   - About page with all content sections
   - Contact page with lead form
   - Legal pages: Privacy, Terms, Refund, Disclaimer, Cookie Policy

4. **Routing**
   - Updated App.jsx to use new router
   - All routes properly configured
   - 404 handler included

5. **Styling**
   - Enhanced CSS with smooth scrolling
   - Anchor link support (#divisions)
   - Responsive design with TailwindCSS
   - Professional color scheme

6. **Analytics**
   - Page view tracking on all pages
   - CTA click tracking
   - Division click tracking
   - Form submission tracking

## Testing Checklist

- [ ] Run Prisma migration successfully
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Home page displays all sections
- [ ] Navigation works (Home, About, Contact)
- [ ] Anchor link to #divisions works
- [ ] Lead form validation works
- [ ] Lead form submission works (check backend logs)
- [ ] Rate limiting works (try 21 requests quickly)
- [ ] All legal pages are accessible
- [ ] SEO meta tags are set correctly
- [ ] Footer links work
- [ ] Mobile responsive design

## Notes

- The Lead form uses `sourcePage` parameter ("home" or "contact")
- Rate limiting is in-memory (will reset on server restart)
- All content is in `siteContent.json` for easy updates
- Anchor links use smooth scrolling
- All pages track analytics events












