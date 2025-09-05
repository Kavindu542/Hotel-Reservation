#!/usr/bin/env python3
"""
Simple test script to verify the Hotel Reservation API endpoints
Run this after starting the Flask server
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_hotels_list():
    """Test the hotels listing endpoint"""
    print("\nTesting hotels list...")
    try:
        response = requests.get(f"{BASE_URL}/api/hotels")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data.get('hotels', []))} hotels")
            if data.get('hotels'):
                print(f"First hotel: {data['hotels'][0]['name']}")
                return data['hotels'][0]['id']  # Return first hotel ID for testing
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_hotel_search():
    """Test the hotel search endpoint"""
    print("\nTesting hotel search...")
    try:
        response = requests.get(f"{BASE_URL}/api/hotels/search?q=New York")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Search results: {data.get('total', 0)} hotels found")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_user_registration():
    """Test user registration"""
    print("\nTesting user registration...")
    try:
        user_data = {
            "username": "testuser_api",
            "email": "testapi@example.com",
            "password": "password123",
            "first_name": "Test",
            "last_name": "APIUser"
        }
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=user_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"User created: {data.get('user', {}).get('username')}")
            return data.get('access_token')
        else:
            print(f"Response: {response.json()}")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_user_login():
    """Test user login"""
    print("\nTesting user login...")
    try:
        login_data = {
            "username": "john_doe",
            "password": "password123"
        }
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Login successful: {data.get('user', {}).get('username')}")
            return data.get('access_token')
        else:
            print(f"Response: {response.json()}")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_booking_creation(token, hotel_id):
    """Test booking creation with authentication"""
    if not token:
        print("\nSkipping booking creation (no token)")
        return False
    
    if not hotel_id:
        print("\nSkipping booking creation (no hotel ID)")
        return False
    
    print("\nTesting booking creation...")
    try:
        # Get tomorrow's date
        tomorrow = datetime.now() + timedelta(days=1)
        day_after = datetime.now() + timedelta(days=3)
        
        booking_data = {
            "hotel_id": hotel_id,
            "check_in_date": tomorrow.strftime("%Y-%m-%d"),
            "check_out_date": day_after.strftime("%Y-%m-%d"),
            "num_guests": 2,
            "room_type": "Standard",
            "special_requests": "Test booking from API"
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/bookings",
            json=booking_data,
            headers=headers
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"Booking created: ID {data.get('booking', {}).get('id')}")
            return True
        else:
            print(f"Response: {response.json()}")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_user_bookings(token):
    """Test getting user bookings"""
    if not token:
        print("\nSkipping user bookings (no token)")
        return False
    
    print("\nTesting user bookings...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/bookings", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"User has {len(data.get('bookings', []))} bookings")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Run all tests"""
    print("=== Hotel Reservation API Test Suite (MongoDB) ===\n")
    
    # Test basic endpoints
    health_ok = test_health_check()
    hotels_ok = test_hotels_list()
    hotel_id = None
    if hotels_ok:
        hotel_id = test_hotels_list()
    search_ok = test_hotel_search()
    
    # Test authentication
    token = test_user_login()
    if not token:
        token = test_user_registration()
    
    # Test authenticated endpoints
    if token and hotel_id:
        booking_ok = test_booking_creation(token, hotel_id)
    else:
        booking_ok = False
    
    if token:
        bookings_ok = test_user_bookings(token)
    else:
        bookings_ok = False
    
    # Summary
    print("\n=== Test Summary ===")
    print(f"Health Check: {'✓' if health_ok else '✗'}")
    print(f"Hotels List: {'✓' if hotels_ok else '✗'}")
    print(f"Hotel Search: {'✓' if search_ok else '✗'}")
    print(f"Authentication: {'✓' if token else '✗'}")
    print(f"Booking Creation: {'✓' if booking_ok else '✗'}")
    print(f"User Bookings: {'✓' if bookings_ok else '✗'}")
    
    if all([health_ok, hotels_ok, search_ok, token, booking_ok, bookings_ok]):
        print("\n🎉 All tests passed! API is working correctly with MongoDB.")
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.")

if __name__ == "__main__":
    main()
