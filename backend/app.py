from flask import Flask, jsonify
from extensions import db
from models import Customers, Tables, Reservations
from routes import reservation_routes

def create_app():
    app = Flask(__name__)

    # Configure SQLAlchemy
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)

    app.register_blueprint(reservation_routes)

    
    def init_tables():
        # Check if tables already exist to avoid duplicates
        if not Tables.query.first():
            # Create tables with different capacities
            sample_tables = [
                Tables(capacity=2),  
                Tables(capacity=2),
                Tables(capacity=4), 
                Tables(capacity=4),
                Tables(capacity=4),
                Tables(capacity=4),
                Tables(capacity=6),  
                Tables(capacity=8)   
            ]
            db.session.add_all(sample_tables)
            db.session.commit()
            print("Tables initialized successfully!")

    # Create tables within app context
    with app.app_context():
        db.create_all()
        init_tables()  # Initialize tables
    
    return app

app = create_app()


if __name__ == '__main__':
    app.run(debug=True)
