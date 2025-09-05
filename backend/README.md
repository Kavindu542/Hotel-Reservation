# Hotel Reservation Backend API

A robust Flask-based REST API for hotel reservation management with user authentication, hotel management, and booking functionality, built with MongoDB.

## Features

- **User Management**: Registration, login, profile management with JWT authentication
- **Hotel Management**: Hotel listings, search, filtering, and availability checking
- **Booking System**: Create, view, update, and cancel hotel bookings
- **Security**: Password hashing, JWT tokens, and input validation
- **Database**: MongoDB with MongoEngine ODM for flexible document storage

## Tech Stack

- **Backend**: Python 3.8+
- **Framework**: Flask 3.0.0
- **Database**: MongoDB with MongoEngine ODM
- **Authentication**: JWT with Flask-JWT-Extended
- **Password Hashing**: Flask-Bcrypt
- **CORS**: Flask-CORS for frontend integration

## Prerequisites

- **Python 3.8 or higher**
- **MongoDB** running locally or MongoDB Atlas account
- **pip** (Python package installer)

## Project Structure

```
hotel-reservation-backend/
├── app.py                 # Main Flask application
├── models.py             # MongoDB models (User, Hotel, Booking)
├── requirements.txt      # Python dependencies
├── seed_data.py         # Database seeding script
├── env.example          # Environment variables template
├── README.md            # This file
└── routes/              # API route blueprints
    ├── __init__.py
    ├── auth.py          # Authentication routes
    ├── hotels.py        # Hotel management routes
    └── bookings.py      # Booking management routes
```

## Setup Instructions

### 1. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb

# Start MongoDB service
# Windows: Start MongoDB service
# macOS: brew services start mongodb-community
# Ubuntu: sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a cluster and get connection string
- Update `MONGODB_URI` in `.env` file

### 2. Backend Setup

```bash
# Clone the repository (if not already done)
cd hotel-reservation-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env file with your configuration
# Update MONGODB_URI with your MongoDB connection string
```

### 4. Database Setup

```bash
# Seed with sample data (recommended for testing)
python seed_data.py
```

### 5. Run the Application

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## MongoDB Configuration

### Connection String Format
```
mongodb://localhost:27017/hotels_reserved
```

### For MongoDB Atlas
```
mongodb+srv://username:password@cluster.mongodb.net/hotels_reserved
```

### Collections Created
- **users**: User accounts and profiles
- **hotels**: Hotel information and details
- **bookings**: Reservation records

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (JWT required)
- `PUT /profile` - Update user profile (JWT required)

### Hotels (`/api/hotels`)

- `GET /` - List hotels with filtering and pagination
- `GET /<id>` - Get hotel details
- `GET /search?q=<query>` - Search hotels
- `GET /<id>/availability` - Check hotel availability

### Bookings (`/api/bookings`)

- `POST /` - Create new booking (JWT required)
- `GET /` - Get user bookings (JWT required)
- `GET /<id>` - Get booking details (JWT required)
- `PUT /<id>` - Update booking (JWT required)
- `POST /<id>/cancel` - Cancel booking (JWT required)

## Sample Data

The seed script creates:
- 2 sample users (admin/admin123, john_doe/password123)
- 5 sample hotels with amenities and images
- 2 sample bookings

## Testing the API

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### 3. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 4. Get Hotels
```bash
curl http://localhost:5000/api/hotels
```

### 5. Create Booking (with JWT token)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "hotel_id": "HOTEL_OBJECT_ID",
    "check_in_date": "2024-02-01",
    "check_out_date": "2024-02-03",
    "num_guests": 2,
    "room_type": "Standard"
  }'
```

## Database Models

### User (Document)
- Basic user information (username, email, password_hash, etc.)
- MongoDB ObjectId as primary key
- Indexes on username and email for performance

### Hotel (Document)
- Hotel details (name, description, address, amenities, etc.)
- Pricing and availability information
- Indexes on city, rating, and price for filtering

### Booking (Document)
- Booking details (dates, guests, room type, etc.)
- References to User and Hotel documents
- Status tracking (confirmed, cancelled, completed)

## MongoDB Features Used

- **Document Storage**: Flexible schema for hotel amenities and images
- **Indexing**: Performance optimization for common queries
- **References**: Document relationships between User, Hotel, and Booking
- **Aggregation**: Complex queries for availability checking
- **Text Search**: Full-text search capabilities

## Configuration Options

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `SECRET_KEY`: Flask secret key
- `JWT_SECRET_KEY`: JWT signing key
- `FLASK_ENV`: Environment (development/production)
- `FLASK_DEBUG`: Debug mode

## Development

### Adding New Routes
1. Create new blueprint in `routes/` directory
2. Import and register in `app.py`
3. Follow existing pattern for error handling and validation

### Database Operations
- Use MongoEngine Document methods: `.save()`, `.delete()`, `.objects.filter()`
- Leverage MongoDB aggregation for complex queries
- Use `__raw__` for advanced MongoDB query operators

### Testing
Add unit tests using pytest or similar testing framework.

## Production Deployment

### Security Considerations
- Change default secret keys
- Use environment variables for sensitive data
- Enable HTTPS
- Set appropriate CORS policies
- Use MongoDB Atlas or secure MongoDB instance

### Performance
- Use production WSGI server (Gunicorn, uWSGI)
- Implement MongoDB connection pooling
- Use appropriate indexes for your query patterns
- Consider MongoDB sharding for large datasets

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure MongoDB is running and accessible
2. **Import Errors**: Ensure virtual environment is activated
3. **JWT Errors**: Verify JWT_SECRET_KEY is set
4. **CORS Issues**: Check CORS configuration for frontend integration

### MongoDB Commands
```bash
# Connect to MongoDB shell
mongosh

# Switch to database
use hotels_reserved

# View collections
show collections

# View documents
db.users.find()
db.hotels.find()
db.bookings.find()
```

## Contributing

1. Follow existing code style and patterns
2. Add proper error handling and validation
3. Update documentation for new features
4. Test thoroughly before submitting

## License

This project is for educational purposes. Feel free to modify and use as needed.
