# Stayspot (MajorProject-1)

A simple listings (stay) web application built with Node.js, Express, EJS and MongoDB.

This repository provides routes, models, views and controllers for creating, editing, viewing and deleting listings. It also includes authentication helpers, file upload integration (Cloudinary + Multer), and mapping support (Mapbox).

---

## Table of Contents
- Project overview
- Prerequisites
- Installation
- Environment variables
- Available scripts
- Project structure
- How to run and test
- API examples (curl / Hoppscotch)
- Dependencies (npm packages used)
- Troubleshooting
- Next steps

---

## Project overview

Stayspot is a simple CRUD application for managing listing records (title, description, image link, price, location, country). It uses:
- Express for the server and routing
- EJS + `ejs-mate` for templating and layout
- Mongoose for MongoDB object modeling
- Joi for request validation
- Multer + Cloudinary for image handling (configured in project files where used)
- Passport for authentication scaffolding (local strategy)

This project is intended as a learning / demo app and contains the basic components of a typical Node.js web app.

## Prerequisites

- Node.js (v16+ recommended)
- npm (or yarn)
- MongoDB running locally or a MongoDB Atlas connection string
- (Optional) Cloudinary account if you want image uploads
- (Optional) Mapbox token if you want geocoding/mapping features

## Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url> stayspot
cd stayspot
npm install
```

If you plan to use `nodemon` for development auto-reload:

```bash
npm install --save-dev nodemon
# then add a package.json script:
# "dev": "nodemon app.js"
```

## Environment variables

Create a `.env` file in the project root (or set environment variables in your environment). Common variables used by this project:

- `MONGO_URI` — MongoDB connection string (default used in code: `mongodb://127.0.0.1:27017/wanderlust`)
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name (if using Cloudinary uploads)
- `CLOUDINARY_KEY` — Cloudinary API key
- `CLOUDINARY_SECRET` — Cloudinary API secret
- `MAPBOX_TOKEN` — Mapbox API token (if using geocoding)
- `SESSION_SECRET` — secret for `express-session`

Example `.env` (do NOT commit this file):

```
MONGO_URI=mongodb://127.0.0.1:27017/wanderlust
SESSION_SECRET=your-session-secret
MAPBOX_TOKEN=pk.xxxxx
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_KEY=xxx
CLOUDINARY_SECRET=yyy
```

## Available scripts

From `package.json`:

- `npm start` — start the server with `node app.js`.

Recommended dev script (add to `package.json` under `scripts`):

```json
"dev": "nodemon app.js"
```

## Project structure (important files & folders)

Top-level:

- `app.js` — main Express app and route registrations
- `package.json` — project metadata and dependencies
- `schema.js` — Joi validation schema for listings
- `models/` — Mongoose models (`listing.js`, `user.js`, `review.js`)
- `controllers/` — controller logic for listings, reviews, users
- `routes/` — Express routers for listing/review/user
- `views/` — EJS templates (layouts, partials, pages)
- `public/` — static assets (CSS, client JS)
- `utils/` — helper utilities (ExpressError, wrapAsync)

Example view files:

- `views/listings/new.ejs`, `views/listings/edit.ejs`, `views/listings/index.ejs`, `views/listings/show.ejs`

## How to run and test

1. Ensure MongoDB is running or `MONGO_URI` points to a valid instance.
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
# production / plain
npm start

# development (if you installed nodemon)
npm run dev
```

4. Open the app in your browser: `http://localhost:8080` (the code uses port `8080` by default). or Use `https://stayspot-sqyd.onrender.com`

## API examples (curl + Hoppscotch)

Create a listing using `application/x-www-form-urlencoded`:

```bash
curl -v -X POST http://localhost:8080/listings \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "listing[title]=Test&listing[description]=Desc&listing[price]=100&listing[location]=X&listing[country]=Y"
```

Create a listing using JSON (Hoppscotch raw JSON body):

```bash
curl -v -X POST http://localhost:8080/listings \
  -H "Content-Type: application/json" \
  -d '{"listing":{"title":"Test","description":"Desc","price":100,"location":"X","country":"Y"}}'
```

Note: when testing with Hoppscotch or other clients, ensure the `Content-Type` header is set to match the body format (`application/json` or `application/x-www-form-urlencoded`) — if the header is missing, the server's body parsers may not run and `req.body` will be undefined.

## Dependencies (npm packages used)

This project lists the following dependencies in `package.json`:

- `@mapbox/mapbox-sdk` ^0.16.2 — Mapbox SDK for geocoding or map operations
- `cloudinary` ^1.37.2 — Cloudinary SDK for uploading/managing images
- `connect-flash` ^0.1.1 — flash messages middleware for Express
- `cookie-parser` ^1.4.7 — cookie parsing middleware
- `dotenv` ^17.2.3 — loads environment variables from `.env`
- `ejs` ^3.1.10 — templating engine
- `ejs-mate` ^4.0.0 — layout engine for EJS templates
- `express` ^5.1.0 — web framework (Express v5)
- `express-session` ^1.18.2 — session middleware
- `joi` ^18.0.1 — validation library
- `method-override` ^3.0.0 — supports HTTP verbs like PUT/DELETE in forms
- `mongoose` ^8.18.2 — MongoDB ODM
- `multer` ^2.0.2 — multipart/form-data handling (file uploads)
- `multer-storage-cloudinary` ^4.0.0 — Cloudinary storage engine for multer
- `passport` ^0.7.0 — authentication middleware
- `passport-local` ^1.0.0 — local username/password strategy for Passport
- `passport-local-mongoose` ^8.0.0 — convenience plugin for Mongoose user model

Dev tooling you might want to add:
- `nodemon` — automatic server restarts during development

## Troubleshooting

- If `req.body` is `undefined` for POST requests, verify the `Content-Type` header and body format. Example issues seen during development:
  - Hoppscotch Chrome extension sent a POST without a `Content-Type` header; use the web app or set `Content-Type` explicitly.
  - Ensure `app.use(express.urlencoded({ extended: true }))` and/or `app.use(express.json())` are present and registered before routes that rely on `req.body`.

- If nodemon restarts continuously, it may be watching files that change frequently (e.g., editor temp files). Either run `node app.js` while debugging or add a `nodemon.json` to ignore folders such as `public/*` and `node_modules/*`.

## Next steps and suggestions

- Add tests and a test runner (e.g., Jest) for critical routes and schema validation.
- Add CI (GitHub Actions) to run linting and tests.
- Harden security: use helmet, configure secure cookies in production, and validate/sanitize user input.
- Add pagination and search on listings index.

---

If you want, I can also:
- Add a `nodemon.json` to reduce noisy restarts during development.
- Add a `dev` script to `package.json`.
- Add the optional fallback body parser (if you must accept requests with missing Content-Type).

If you'd like any of the above edits done now, tell me which and I'll apply them.