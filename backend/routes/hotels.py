from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import json

hotels_bp = Blueprint('hotels', __name__)

def _require_admin():
    from models import User
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()
    return bool(user and user.is_admin)

@hotels_bp.route('/', methods=['GET'])
@hotels_bp.route('', methods=['GET'])
def get_hotels():
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        city = request.args.get('city')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        rating = request.args.get('rating', type=float)
        
        # Build query
        from models import Hotel
        query = Hotel.objects
        
        if city:
            query = query.filter(city__icontains=city)
        
        if min_price is not None:
            query = query.filter(price_per_night__gte=min_price)
        
        if max_price is not None:
            query = query.filter(price_per_night__lte=max_price)
        
        if rating is not None:
            query = query.filter(rating__gte=rating)
        
        # Get total count for pagination
        total = query.count()
        
        # Apply pagination
        skip = (page - 1) * per_page
        hotels = query.skip(skip).limit(per_page)
        
        hotel_list = []
        for hotel in hotels:
            hotel_data = {
                'id': str(hotel.id),
                'name': hotel.name,
                'description': hotel.description,
                'address': hotel.address,
                'city': hotel.city,
                'state': hotel.state,
                'country': hotel.country,
                'rating': hotel.rating,
                'price_per_night': hotel.price_per_night,
                'available_rooms': hotel.available_rooms,
                'amenities': hotel.amenities,
                'images': hotel.images
            }
            hotel_list.append(hotel_data)
        
        total_pages = (total + per_page - 1) // per_page
        
        return jsonify({
            'hotels': hotel_list,
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

@hotels_bp.route('/<hotel_id>', methods=['GET'])
def get_hotel_detail(hotel_id):
    try:
        from models import Hotel
        hotel = Hotel.objects(id=hotel_id).first()
        
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        
        hotel_data = {
            'id': str(hotel.id),
            'name': hotel.name,
            'description': hotel.description,
            'address': hotel.address,
            'city': hotel.city,
            'state': hotel.state,
            'country': hotel.country,
            'zip_code': hotel.zip_code,
            'phone': hotel.phone,
            'email': hotel.email,
            'website': hotel.website,
            'rating': hotel.rating,
            'price_per_night': hotel.price_per_night,
            'total_rooms': hotel.total_rooms,
            'available_rooms': hotel.available_rooms,
            'amenities': hotel.amenities,
            'images': hotel.images,
            'created_at': hotel.created_at.isoformat()
        }
        
        return jsonify(hotel_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@hotels_bp.route('/search', methods=['GET'])
def search_hotels():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        
        # Search in hotel name, description, city, and address
        from models import Hotel
        hotels = Hotel.objects.filter(
            __raw__={
                '$or': [
                    {'name': {'$regex': query, '$options': 'i'}},
                    {'description': {'$regex': query, '$options': 'i'}},
                    {'city': {'$regex': query, '$options': 'i'}},
                    {'address': {'$regex': query, '$options': 'i'}}
                ]
            }
        ).limit(20)
        
        hotel_list = []
        for hotel in hotels:
            hotel_data = {
                'id': str(hotel.id),
                'name': hotel.name,
                'description': hotel.description,
                'city': hotel.city,
                'rating': hotel.rating,
                'price_per_night': hotel.price_per_night,
                'available_rooms': hotel.available_rooms
            }
            hotel_list.append(hotel_data)
        
        return jsonify({
            'query': query,
            'results': hotel_list,
            'total': len(hotel_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@hotels_bp.route('/<hotel_id>/availability', methods=['GET'])
def check_availability(hotel_id):
    try:
        from models import Hotel, Booking
        hotel = Hotel.objects(id=hotel_id).first()
        
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        
        check_in = request.args.get('check_in')
        check_out = request.args.get('check_out')
        
        if not check_in or not check_out:
            return jsonify({'error': 'Check-in and check-out dates are required'}), 400
        
        try:
            check_in_date = datetime.strptime(check_in, '%Y-%m-%d').date()
            check_out_date = datetime.strptime(check_out, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        if check_in_date >= check_out_date:
            return jsonify({'error': 'Check-out date must be after check-in date'}), 400
        
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
        
        return jsonify({
            'hotel_id': str(hotel.id),
            'check_in': check_in,
            'check_out': check_out,
            'available_rooms': available_rooms,
            'total_rooms': hotel.total_rooms,
            'price_per_night': hotel.price_per_night,
            'is_available': available_rooms > 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin create
@hotels_bp.route('/', methods=['POST'])
@hotels_bp.route('', methods=['POST'])
@jwt_required()
def create_hotel():
    try:
        if not _require_admin():
            return jsonify({'error': 'Admin privileges required'}), 403
        data = request.get_json()
        from models import Hotel
        required = ['name','address','city','country','price_per_night','total_rooms','available_rooms']
        for f in required:
            if data.get(f) in [None, '']:
                return jsonify({'error': f'{f} is required'}), 400
        hotel = Hotel(
            name=data['name'],
            description=data.get('description',''),
            address=data['address'],
            city=data['city'],
            state=data.get('state',''),
            country=data['country'],
            zip_code=data.get('zip_code',''),
            phone=data.get('phone',''),
            email=data.get('email',''),
            website=data.get('website',''),
            rating=float(data.get('rating', 0)),
            price_per_night=float(data['price_per_night']),
            total_rooms=int(data['total_rooms']),
            available_rooms=int(data['available_rooms']),
            amenities=list(data.get('amenities', [])),
            images=list(data.get('images', []))
        )
        hotel.save()
        return jsonify({'message': 'Hotel created', 'id': str(hotel.id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin update
@hotels_bp.route('/<hotel_id>', methods=['PUT'])
@jwt_required()
def update_hotel(hotel_id):
    try:
        if not _require_admin():
            return jsonify({'error': 'Admin privileges required'}), 403
        from models import Hotel
        hotel = Hotel.objects(id=hotel_id).first()
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        data = request.get_json()
        fields = ['name','description','address','city','state','country','zip_code','phone','email','website','rating','price_per_night','total_rooms','available_rooms','amenities','images']
        for f in fields:
            if f in data:
                setattr(hotel, f, data[f])
        hotel.save()
        return jsonify({'message': 'Hotel updated'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin delete
@hotels_bp.route('/<hotel_id>', methods=['DELETE'])
@jwt_required()
def delete_hotel(hotel_id):
    try:
        if not _require_admin():
            return jsonify({'error': 'Admin privileges required'}), 403
        from models import Hotel
        hotel = Hotel.objects(id=hotel_id).first()
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        hotel.delete()
        return jsonify({'message': 'Hotel deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
