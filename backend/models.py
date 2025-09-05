from mongoengine import Document, StringField, IntField, FloatField, DateTimeField, DateField, ListField, ReferenceField, BooleanField
from datetime import datetime

class User(Document):
    username = StringField(required=True, unique=True, max_length=80)
    email = StringField(required=True, unique=True, max_length=120)
    password_hash = StringField(required=True, max_length=255)
    first_name = StringField(required=True, max_length=50)
    last_name = StringField(required=True, max_length=50)
    phone = StringField(max_length=20)
    is_admin = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'users',
        'indexes': [
            'username',
            'email'
        ]
    }
    
    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        return super(User, self).save(*args, **kwargs)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Hotel(Document):
    name = StringField(required=True, max_length=100)
    description = StringField()
    address = StringField(required=True, max_length=255)
    city = StringField(required=True, max_length=100)
    state = StringField(max_length=100)
    country = StringField(required=True, max_length=100)
    zip_code = StringField(max_length=20)
    phone = StringField(max_length=20)
    email = StringField(max_length=120)
    website = StringField(max_length=255)
    rating = FloatField(default=0.0)
    price_per_night = FloatField(required=True)
    total_rooms = IntField(required=True)
    available_rooms = IntField(required=True)
    amenities = ListField(StringField())
    images = ListField(StringField())
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'hotels',
        'indexes': [
            'city',
            'rating',
            'price_per_night'
        ]
    }
    
    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        return super(Hotel, self).save(*args, **kwargs)
    
    def __repr__(self):
        return f'<Hotel {self.name}>'

class Booking(Document):
    user = ReferenceField(User, required=True)
    hotel = ReferenceField(Hotel, required=True)
    check_in_date = DateField(required=True)
    check_out_date = DateField(required=True)
    num_guests = IntField(required=True)
    room_type = StringField(required=True, max_length=50)
    total_price = FloatField(required=True)
    status = StringField(default='confirmed', max_length=20, choices=['confirmed', 'cancelled', 'completed'])
    special_requests = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'bookings',
        'indexes': [
            'user',
            'hotel',
            'check_in_date',
            'check_out_date',
            'status'
        ]
    }
    
    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        return super(Booking, self).save(*args, **kwargs)
    
    def __repr__(self):
        return f'<Booking {self.id} - User {self.user.username} - Hotel {self.hotel.name}>'
