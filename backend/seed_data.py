from flask import Flask
from flask_bcrypt import Bcrypt
from datetime import datetime, date, timedelta
import json
import os
from dotenv import load_dotenv
from mongoengine import connect, disconnect

# Load environment variables
load_dotenv()

# Initialize extensions
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
    
    # MongoDB Configuration
    mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/hotels_reserved')
    
    # Initialize extensions with app
    bcrypt.init_app(app)
    
    # Connect to MongoDB
    try:
        connect(host=mongodb_uri)
        print(f"Connected to MongoDB: {mongodb_uri}")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
    
    return app

def seed_database():
    app = create_app()
    
    try:
        # Import models after connecting to MongoDB
        from models import User, Hotel, Booking
        
        # Clear existing data
        User.objects.delete()
        Hotel.objects.delete()
        Booking.objects.delete()
        print("Cleared existing data")
        
        # Create sample users
        # Admin user
        admin_user = User(
            username='admin',
            email='admin@hotel.com',
            password_hash=bcrypt.generate_password_hash('admin123').decode('utf-8'),
            first_name='Admin',
            last_name='User',
            phone='+1234567890',
            is_admin=True
        )
        
        # Regular user
        regular_user = User(
            username='john_doe',
            email='john@example.com',
            password_hash=bcrypt.generate_password_hash('password123').decode('utf-8'),
            first_name='John',
            last_name='Doe',
            phone='+1987654321'
        )
        
        admin_user.save()
        regular_user.save()
        print("Created users")
        
        # Create sample hotels
        hotels_data = [
            {
                'name': 'Grand Plaza Hotel',
                'description': 'Luxurious 5-star hotel in the heart of downtown with stunning city views and world-class amenities.',
                'address': '123 Main Street',
                'city': 'New York',
                'state': 'NY',
                'country': 'USA',
                'zip_code': '10001',
                'phone': '+1-212-555-0100',
                'email': 'info@grandplaza.com',
                'website': 'https://grandplaza.com',
                'rating': 4.8,
                'price_per_night': 299.99,
                'total_rooms': 200,
                'available_rooms': 150,
                'amenities': ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Concierge'],
                'images': [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
                ]
            },
            {
                'name': 'Seaside Resort & Spa',
                'description': 'Beautiful beachfront resort offering relaxation and adventure with private beach access.',
                'address': '456 Ocean Drive',
                'city': 'Miami',
                'state': 'FL',
                'country': 'USA',
                'zip_code': '33139',
                'phone': '+1-305-555-0200',
                'email': 'reservations@seaside.com',
                'website': 'https://seaside.com',
                'rating': 4.6,
                'price_per_night': 199.99,
                'total_rooms': 150,
                'available_rooms': 120,
                'amenities': ['Private Beach', 'Pool', 'Spa', 'Water Sports', 'Restaurant', 'Bar', 'Kids Club'],
                'images': [
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
                ]
            },
            {
                'name': 'Mountain View Lodge',
                'description': 'Cozy mountain retreat perfect for nature lovers and outdoor enthusiasts.',
                'address': '789 Mountain Road',
                'city': 'Denver',
                'state': 'CO',
                'country': 'USA',
                'zip_code': '80202',
                'phone': '+1-303-555-0300',
                'email': 'info@mountainview.com',
                'website': 'https://mountainview.com',
                'rating': 4.4,
                'price_per_night': 149.99,
                'total_rooms': 80,
                'available_rooms': 65,
                'amenities': ['Mountain Views', 'Hiking Trails', 'Fireplace', 'Restaurant', 'Bar', 'Free WiFi'],
                'images': [
                    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
                ]
            },
            {
                'name': 'Urban Boutique Hotel',
                'description': 'Modern boutique hotel with contemporary design and personalized service.',
                'address': '321 Downtown Ave',
                'city': 'San Francisco',
                'state': 'CA',
                'country': 'USA',
                'zip_code': '94102',
                'phone': '+1-415-555-0400',
                'email': 'hello@urbanboutique.com',
                'website': 'https://urbanboutique.com',
                'rating': 4.7,
                'price_per_night': 249.99,
                'total_rooms': 60,
                'available_rooms': 45,
                'amenities': ['Designer Rooms', 'Rooftop Bar', 'Art Gallery', 'Restaurant', 'Concierge', 'Free WiFi'],
                'images': [
                    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
                ]
            },
            {
                'name': 'Historic Inn',
                'description': 'Charming historic inn with period architecture and modern comforts.',
                'address': '654 Heritage Lane',
                'city': 'Boston',
                'state': 'MA',
                'country': 'USA',
                'zip_code': '02108',
                'phone': '+1-617-555-0500',
                'email': 'stay@historicinn.com',
                'website': 'https://historicinn.com',
                'rating': 4.5,
                'price_per_night': 179.99,
                'total_rooms': 40,
                'available_rooms': 30,
                'amenities': ['Historic Architecture', 'Garden', 'Library', 'Restaurant', 'Afternoon Tea', 'Free WiFi'],
                'images': [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
                ]
            }
        ]
        
        hotels = []
        for hotel_data in hotels_data:
            hotel = Hotel(**hotel_data)
            hotel.save()
            hotels.append(hotel)
        
        print("Created hotels")
        
        # Create sample bookings
        sample_bookings = [
            {
                'user': regular_user,
                'hotel': hotels[0],  # Grand Plaza Hotel
                'check_in_date': date.today() + timedelta(days=30),
                'check_out_date': date.today() + timedelta(days=33),
                'num_guests': 2,
                'room_type': 'Deluxe King',
                'total_price': 899.97,
                'status': 'confirmed',
                'special_requests': 'High floor room with city view'
            },
            {
                'user': regular_user,
                'hotel': hotels[1],  # Seaside Resort
                'check_in_date': date.today() + timedelta(days=60),
                'check_out_date': date.today() + timedelta(days=65),
                'num_guests': 4,
                'room_type': 'Ocean View Suite',
                'total_price': 999.95,
                'status': 'confirmed',
                'special_requests': 'Connecting rooms preferred'
            }
        ]
        
        for booking_data in sample_bookings:
            booking = Booking(**booking_data)
            booking.save()
        
        print("Created bookings")
        
        print("Database seeded successfully!")
        print(f"Created {len(hotels_data)} hotels")
        print(f"Created {len(sample_bookings)} sample bookings")
        print(f"Created 2 users (admin and regular user)")
        print("Admin credentials => username: admin, password: admin123")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Disconnect from MongoDB
        disconnect()

if __name__ == '__main__':
    seed_database()
