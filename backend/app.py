from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from mongoengine import connect, disconnect

# Load environment variables
load_dotenv()

# Initialize extensions
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    
    # MongoDB Configuration
    mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/hotels_reserved')
    
    # Initialize extensions with app
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)
    
    # Connect to MongoDB
    try:
        connect(host=mongodb_uri)
        print(f"Connected to MongoDB: {mongodb_uri}")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
    
    # Import and register blueprints
    from routes.auth import auth_bp
    from routes.hotels import hotels_bp
    from routes.bookings import bookings_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(hotels_bp, url_prefix='/api/hotels')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    
    @app.route('/')
    def home():
        return jsonify({'message': 'Hotel Reservation API is running!'})
    
    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})
    
    return app

# Create the app instance
app = create_app()

if __name__ == '__main__':
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    finally:
        # Disconnect from MongoDB when shutting down
        disconnect()
