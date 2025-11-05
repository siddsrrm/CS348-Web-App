from flask import Flask
from flask_cors import CORS
from extensions import db
from models import Customers, Tables, Reservations
from routes import reservation_routes

def create_app():
    app = Flask(__name__)
    CORS(app)
    # Configure SQLAlchemy
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)

    # Register blueprint with URL prefix
    app.register_blueprint(reservation_routes, url_prefix='/api')

   

    def init_tables():
        if not Tables.query.first():
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
        init_tables()
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
