from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, date
import json

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['hotel_id', 'check_in_date', 'check_out_date', 'num_guests', 'room_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Parse dates
        try:
            check_in_date = datetime.strptime(data['check_in_date'], '%Y-%m-%d').date()
            check_out_date = datetime.strptime(data['check_out_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Validate dates
        if check_in_date < date.today():
            return jsonify({'error': 'Check-in date cannot be in the past'}), 400
        
        if check_in_date >= check_out_date:
            return jsonify({'error': 'Check-out date must be after check-in date'}), 400
        
        # Check hotel availability
        from models import Hotel, Booking, User
        hotel = Hotel.objects(id=data['hotel_id']).first()
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        
        user = User.objects(id=current_user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Calculate number of nights
        nights = (check_out_date - check_in_date).days
        
        # Check for conflicting bookings
        conflicting_bookings = Booking.objects.filter(
            hotel=hotel,
            status='confirmed',
            __raw__={
                '$or': [
                    {
                        'check_in_date': {'$lte': check_in_date},
                        'check_out_date': {'$gt': check_in_date}
                    },
                    {
                        'check_in_date': {'$lt': check_out_date},
                        'check_out_date': {'$gte': check_out_date}
                    },
                    {
                        'check_in_date': {'$gte': check_in_date},
                        'check_out_date': {'$lte': check_out_date}
                    }
                ]
            }
        ).count()
        
        available_rooms = max(0, hotel.available_rooms - conflicting_bookings)
        if available_rooms <= 0:
            return jsonify({'error': 'No rooms available for the selected dates'}), 400
        
        # Calculate total price
        total_price = hotel.price_per_night * nights
        
        # Create booking
        new_booking = Booking(
            user=user,
            hotel=hotel,
            check_in_date=check_in_date,
            check_out_date=check_out_date,
            num_guests=data['num_guests'],
            room_type=data['room_type'],
            total_price=total_price,
            special_requests=data.get('special_requests', '')
        )
        
        new_booking.save()
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': {
                'id': str(new_booking.id),
                'hotel_id': str(hotel.id),
                'check_in_date': new_booking.check_in_date.isoformat(),
                'check_out_date': new_booking.check_out_date.isoformat(),
                'num_guests': new_booking.num_guests,
                'room_type': new_booking.room_type,
                'total_price': new_booking.total_price,
                'status': new_booking.status,
                'created_at': new_booking.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_bookings():
    try:
        current_user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        # Build query
        from models import Booking, Hotel, User
        user = User.objects(id=current_user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        query = Booking.objects.filter(user=user)
        
        if status:
            query = query.filter(status=status)
        
        # Order by creation date (newest first)
        query = query.order_by('-created_at')
        
        # Get total count for pagination
        total = query.count()
        
        # Apply pagination
        skip = (page - 1) * per_page
        bookings = query.skip(skip).limit(per_page)
        
        booking_list = []
        for booking in bookings:
            # Get hotel information
            hotel = booking.hotel
            hotel_info = {
                'id': str(hotel.id),
                'name': hotel.name,
                'city': hotel.city,
                'country': hotel.country
            } if hotel else None
            
            booking_data = {
                'id': str(booking.id),
                'hotel': hotel_info,
                'check_in_date': booking.check_in_date.isoformat(),
                'check_out_date': booking.check_out_date.isoformat(),
                'num_guests': booking.num_guests,
                'room_type': booking.room_type,
                'total_price': booking.total_price,
                'status': booking.status,
                'special_requests': booking.special_requests,
                'created_at': booking.created_at.isoformat()
            }
            booking_list.append(booking_data)
        
        total_pages = (total + per_page - 1) // per_page
        
        return jsonify({
            'bookings': booking_list,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'pages': total_pages,
                'has_next': page < total_pages,
                'has_prev': page > 1
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/<booking_id>', methods=['GET'])
@jwt_required()
def get_booking_detail(booking_id):
    try:
        current_user_id = get_jwt_identity()
        from models import Booking, Hotel, User
        booking = Booking.objects(id=booking_id).first()
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check if user owns this booking
        if str(booking.user.id) != current_user_id:
            return jsonify({'error': 'Unauthorized access'}), 403
        
        # Get hotel information
        hotel = booking.hotel
        hotel_info = {
            'id': str(hotel.id),
            'name': hotel.name,
            'address': hotel.address,
            'city': hotel.city,
            'state': hotel.state,
            'country': hotel.country,
            'phone': hotel.phone,
            'email': hotel.email
        } if hotel else None
        
        booking_data = {
            'id': str(booking.id),
            'hotel': hotel_info,
            'check_in_date': booking.check_in_date.isoformat(),
            'check_out_date': booking.check_out_date.isoformat(),
            'num_guests': booking.num_guests,
            'room_type': booking.room_type,
            'total_price': booking.total_price,
            'status': booking.status,
            'special_requests': booking.special_requests,
            'created_at': booking.created_at.isoformat(),
            'updated_at': booking.updated_at.isoformat()
        }
        
        return jsonify(booking_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/<booking_id>', methods=['PUT'])
@jwt_required()
def update_booking(booking_id):
    try:
        current_user_id = get_jwt_identity()
        from models import Booking, Hotel, User
        booking = Booking.objects(id=booking_id).first()
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check if user owns this booking
        if str(booking.user.id) != current_user_id:
            return jsonify({'error': 'Unauthorized access'}), 403
        
        # Check if booking can be modified
        if booking.status != 'confirmed':
            return jsonify({'error': 'Only confirmed bookings can be modified'}), 400
        
        data = request.get_json()
        
        # Update allowed fields
        if 'special_requests' in data:
            booking.special_requests = data['special_requests']
        
        if 'room_type' in data:
            booking.room_type = data['room_type']
        
        if 'num_guests' in data:
            booking.num_guests = data['num_guests']
        
        # Update dates if provided
        if 'check_in_date' in data or 'check_out_date' in data:
            new_check_in = data.get('check_in_date', booking.check_in_date.isoformat())
            new_check_out = data.get('check_out_date', booking.check_out_date.isoformat())
            
            try:
                check_in_date = datetime.strptime(new_check_in, '%Y-%m-%d').date()
                check_out_date = datetime.strptime(new_check_out, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
            
            if check_in_date >= check_out_date:
                return jsonify({'error': 'Check-out date must be after check-in date'}), 400
            
            # Check availability for new dates
            hotel = booking.hotel
            conflicting_bookings = Booking.objects.filter(
                hotel=hotel,
                status='confirmed',
                id__ne=booking_id,
                __raw__={
                    '$or': [
                        {
                            'check_in_date': {'$lte': check_in_date},
                            'check_out_date': {'$gt': check_in_date}
                        },
                        {
                            'check_in_date': {'$lt': check_out_date},
                            'check_out_date': {'$gte': check_out_date}
                        },
                        {
                            'check_in_date': {'$gte': check_in_date},
                            'check_out_date': {'$lte': check_out_date}
                        }
                    ]
                }
            ).count()
            
            available_rooms = max(0, hotel.available_rooms - conflicting_bookings)
            if available_rooms <= 0:
                return jsonify({'error': 'No rooms available for the new dates'}), 400
            
            # Update dates and recalculate price
            booking.check_in_date = check_in_date
            booking.check_out_date = check_out_date
            nights = (check_out_date - check_in_date).days
            booking.total_price = hotel.price_per_night * nights
        
        booking.save()
        
        return jsonify({
            'message': 'Booking updated successfully',
            'booking': {
                'id': str(booking.id),
                'check_in_date': booking.check_in_date.isoformat(),
                'check_out_date': booking.check_out_date.isoformat(),
                'num_guests': booking.num_guests,
                'room_type': booking.room_type,
                'total_price': booking.total_price,
                'status': booking.status,
                'special_requests': booking.special_requests
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/<booking_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_booking(booking_id):
    try:
        current_user_id = get_jwt_identity()
        from models import Booking
        booking = Booking.objects(id=booking_id).first()
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check if user owns this booking
        if str(booking.user.id) != current_user_id:
            return jsonify({'error': 'Unauthorized access'}), 403
        
        # Check if booking can be cancelled
        if booking.status != 'confirmed':
            return jsonify({'error': 'Only confirmed bookings can be cancelled'}), 400
        
        # Check if check-in date is in the future
        if booking.check_in_date <= date.today():
            return jsonify({'error': 'Cannot cancel booking on or after check-in date'}), 400
        
        # Cancel booking
        booking.status = 'cancelled'
        booking.save()
        
        return jsonify({
            'message': 'Booking cancelled successfully',
            'booking_id': str(booking.id)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
