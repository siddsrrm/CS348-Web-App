from flask import Blueprint, jsonify, request
from extensions import db
from models import Tables, Customers, Reservations
from datetime import datetime, timedelta

# Create a blueprint
reservation_routes = Blueprint('reservations', __name__)

# Route to get available tables
@reservation_routes.route('/tables', methods=['GET'])
def get_tables():
    date = request.args.get('date')
    time = request.args.get('time')
    
    # If no date/time provided, return all tables
    if not date or not time:
        tables = Tables.query.all()
        return jsonify([
            {'table_id': t.table_id, 'capacity': t.capacity}
            for t in tables
        ])
    
    # Convert string inputs to datetime objects
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        time_obj = datetime.strptime(time, '%H:%M').time()
    except ValueError as e:
        return jsonify({'error': 'Invalid date or time format'}), 400
    
    # Get all tables that are not reserved at the specified time
    # Use reservation duration to check for overlaps
    reserved_tables = db.session.query(
        Reservations.table_id,
        Reservations.time,
        Reservations.duration
    ).filter(
        Reservations.date == date_obj
    ).all()
    
    # Check for time overlaps using the actual duration
    reserved_table_ids = []
    requested_datetime = datetime.combine(date_obj, time_obj)
    
    for table_id, res_time, duration in reserved_tables:
        res_datetime = datetime.combine(date_obj, res_time)
        res_end_time = res_datetime + timedelta(minutes=duration)
        
        # Check if the requested time overlaps with an existing reservation
        if (res_datetime <= requested_datetime < res_end_time):
            reserved_table_ids.append(table_id)
    
    # Get all tables that are not in reserved_table_ids
    available_tables = Tables.query.filter(~Tables.table_id.in_(reserved_table_ids)).all()
    
    tables_list = [
        {'table_id': t.table_id, 'capacity': t.capacity}
        for t in available_tables
    ]
    
    return jsonify(tables_list)

@reservation_routes.route('/reservations', methods=['POST'])
def create_reservation():
    data = request.get_json()
    
    # Check if customer exists
    customer = Customers.query.filter_by(email=data['customerEmail']).first()
    if not customer:
        # Create new customer
        customer = Customers(
            name=data['customerName'],
            email=data['customerEmail']
        )
        db.session.add(customer)
        db.session.flush()  # This gets us the customer_id
    
    # Parse date and time
    date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date()
    time_obj = datetime.strptime(data['time'], '%H:%M').time()
    
    # Create new reservation
    reservation = Reservations(
        date=date_obj,
        time=time_obj,
        duration=60, 
        num_guests=int(data['partySize']),
        customer_id=customer.customer_id,
        table_id=int(data['tableId'])
    )
    
    db.session.add(reservation)
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Reservation created successfully',
            'reservation_id': reservation.reservation_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@reservation_routes.route('/reservations', methods=['GET'])
def get_reservations():
    reservations = Reservations.query.all()
    reservations_list = []
    
    for reservation in reservations:
        reservations_list.append({
            'id': reservation.reservation_id,
            'customerName': reservation.customer.name,
            'customerEmail': reservation.customer.email,
            'date': reservation.date.strftime('%Y-%m-%d'),
            'time': reservation.time.strftime('%H:%M'),
            'partySize': reservation.num_guests,
            'tableId': reservation.table_id
        })
    
    return jsonify(reservations_list)

@reservation_routes.route('/reservations/<int:reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    reservation = Reservations.query.get_or_404(reservation_id)
    
    try:
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({'message': 'Reservation deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
