# Stayspot

A full-stack web application for listing and booking accommodations, built with Node.js, Express, EJS, MongoDB, and Mapbox. Users can create listings, write reviews, and explore stays in an interactive map-based interface.

## 📋 Features

- **User Authentication**: Secure sign-up and login using Passport.js with Local Strategy
- **Listing Management**: Create, read, update, and delete (CRUD) listings with multiple images
- **Image Upload**: Cloud-based image storage using Cloudinary
- **Reviews System**: Users can leave reviews and ratings for listings
- **Interactive Maps**: Mapbox integration to display listing locations
- **Session Management**: Express sessions with connect-flash for notifications
- **Data Validation**: Joi schema validation for client and server-side validation
- **Responsive Design**: Mobile-friendly UI with custom CSS styling
- **AI Travel Assistant**: Get personalized travel planning tips and accommodation advice using OpenRouter AI

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy & Passport-Local-Mongoose
- **Validation**: Joi
- **File Upload**: Multer with Cloudinary storage

### Frontend
- **Template Engine**: EJS with EJS-Mate
- **Styling**: Custom CSS
- **Interactive Maps**: Mapbox SDK
- **Client-side Logic**: Vanilla JavaScript

### Other Services
- **Image Storage**: Cloudinary
- **Location Services**: Mapbox
- **AI API**: OpenRouter (for travel planning assistant)

## 📦 Dependencies

```json
{
  "@mapbox/mapbox-sdk": "^0.16.2",
  "cloudinary": "^1.37.2",
  "connect-flash": "^0.1.1",
  "cookie-parser": "^1.4.7",
  "dotenv": "^17.2.3",
  "ejs": "^3.1.10",
  "ejs-mate": "^4.0.0",
  "express": "^5.1.0",
  "express-session": "^1.18.2",
  "joi": "^18.0.1",
  "method-override": "^3.0.0",
  "mongoose": "^8.18.2",
  "multer": "^2.0.2",
  "multer-storage-cloudinary": "^4.0.0",
  "passport": "^0.7.0",
  "passport-local": "^1.0.0",
  "passport-local-mongoose": "^8.0.0"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)
- Mapbox account (for map functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MajorProject-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_api_key
   CLOUDINARY_SECRET=your_api_secret
   MAPBOX_TOKEN=your_mapbox_token
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   OPENROUTER_API_KEY=your_openrouter_api_key
   NODE_ENV=development
   ```

4. **Initialize database**
   ```bash
   node init/index.js
   ```

5. **Start the application**
   ```
   npx nodemon app.js
   ```

The application will run on `http://localhost:8080`

## 🔐 Demo Credentials

- **Username**: demo
- **Password**: demo

## 📁 Project Structure

```
.
├── app.js                 # Main application entry point
├── middleware.js          # Custom middleware
├── cloudConfig.js         # Cloudinary configuration
├── schema.js              # Joi validation schemas
├── package.json           # Dependencies and scripts
│
├── controllers/           # Business logic
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/                # MongoDB schemas
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/                # API routes
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/                 # EJS templates
│   ├── layouts/
│   ├── listings/
│   ├── users/
│   ├── includes/
│   └── error.ejs
│
├── public/                # Static assets
│   ├── css/
│   │   ├── style.css
│   │   └── rating.css
│   └── js/
│       ├── script.js
│       └── map.js
│
├── init/                  # Database initialization
│   ├── data.js
│   └── index.js
│
├── utils/                 # Utility functions
│   ├── ExpressError.js
│   └── wrapAsync.js
```

## 🔄 API Routes

### User Routes (`/user`)
- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `GET /user/logout` - User logout

### Listing Routes (`/listing`)
- `GET /listing` - View all listings
- `GET /listing/new` - New listing form
- `POST /listing` - Create new listing
- `GET /listing/:id` - View listing details
- `GET /listing/:id/edit` - Edit listing form
- `PUT /listing/:id` - Update listing
- `DELETE /listing/:id` - Delete listing

### Review Routes (`/review`)
- `POST /listing/:id/review` - Add review to listing
- `DELETE /listing/:id/review/:reviewId` - Delete review

### AI Assistant Routes
- `POST /ask` - Get travel planning tips and advice from AI assistant

## 💾 Database Models

### User
- Email
- Username
- Password (hashed)
- Created listings
- Created reviews

### Listing
- Title
- Description
- Price
- Location
- Images
- Owner (User reference)
- Reviews (Review references)
- Map coordinates

### Review
- Rating
- Comment
- Author (User reference)
- Listing (Listing reference)

## 🤖 AI Travel Assistant

The application includes an intelligent travel assistant powered by OpenRouter AI that provides:
- Personalized travel planning tips
- Accommodation recommendations
- Information about amenities and locations
- Activity and experience suggestions
- Travel safety and planning advice

The AI is specifically trained as a travel assistant and provides guidance while advising users to confirm details before booking.

## 🔒 Security Features

- Passport.js for authentication
- Password hashing with Passport-Local-Mongoose
- Session-based authentication with express-session
- CSRF protection through method-override
- Input validation with Joi schemas
- Cloudinary secure image uploads
- Secure API calls to external services (OpenRouter, Cloudinary, Mapbox)
