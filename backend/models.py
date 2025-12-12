from extensions import db

class Customers(db.Model):
    __tablename__ = 'customers'

    customer_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    reservations = db.relationship('Reservations', back_populates='customer', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Customer {self.name}>"


class Tables(db.Model):
    __tablename__ = 'tables'

    table_id = db.Column(db.Integer, primary_key=True)
    capacity = db.Column(db.Integer, nullable=False)

    reservations = db.relationship('Reservations', back_populates='table', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Table {self.table_id}, capacity={self.capacity}>"


class Reservations(db.Model):
    __tablename__ = 'reservations'

    reservation_id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # in minutes
    num_guests = db.Column(db.Integer, nullable=False)

    # Foreign keys
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('tables.table_id'), nullable=False)
    
    #indexs
    __table_args__ = (
        db.Index('ix_reservations_date_table', 'date', 'table_id', 'time'),
    )

    # Relationships
    customer = db.relationship('Customers', back_populates='reservations')
    table = db.relationship('Tables', back_populates='reservations')

    def __repr__(self):
        return f"<Reservation {self.reservation_id} on {self.date} at {self.time}>"
