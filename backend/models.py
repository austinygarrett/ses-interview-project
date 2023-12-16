"""Application Models"""
import os, jwt
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import text, Column, Integer, String, Numeric, Time, Date, Text, and_
from geoalchemy2 import Geometry
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

load_dotenv()
#### EARTHQUAKE MODEL ####
class Earthquake(Base):
    __tablename__ = 'earthquake_data'

    id = Column("ID", String(50), primary_key=True)
    date = Column("Date", Date)
    time = Column("Time", Time)
    latitude = Column("Latitude", Numeric)
    longitude = Column("Longitude", Numeric)
    type = Column("Type", String(50))
    depth = Column("Depth", Numeric)
    depth_error = Column("Depth Error", Numeric, default=0.0)
    depth_seismic_stations = Column("Depth Seismic Stations", Integer, default=0)
    magnitude = Column("Magnitude", Numeric)
    magnitude_type = Column("Magnitude Type", String(10))
    magnitude_error = Column("Magnitude Error", Numeric, default=0.0)
    magnitude_seismic_stations = Column("Magnitude Seismic Stations", Numeric, default=0.0)
    azimuthal_gap = Column("Azimuthal Gap", Numeric, default=0.0)
    horizontal_distance = Column("Horizontal Distance", Numeric, default=0.0)
    horizontal_error = Column("Horizontal Error", Numeric, default=0.0)
    root_mean_square = Column("Root Mean Square", Numeric, default=0.0)
    source = Column("Source", String(50))
    location_source = Column("Location Source", String(50))
    magnitude_source = Column("Magnitude Source", String(50))
    status = Column("Status", String(50))
    geom = Column("geometry", Geometry(geometry_type='POINT', srid=4326))

    @classmethod
    def get_by_id(self, session, id):
        return session.query(self).filter(Earthquake.id == id).first()
    
    @classmethod
    def get_all(self, session, page):
        if page is not None:
            return session.query(self).order_by(self.id.asc()).paginate(page=int(page), per_page=50)
        else:
            return session.query(self).all()
    
    @classmethod
    def get_total_rows(self, session):
        return session.query(self).count()      
    
    @classmethod
    def get_dashboard_data(self, session):
        result = session.execute(text('SELECT MAX("Depth") , MAX("Magnitude"), AVG("Depth"), COUNT(*) FROM earthquake_data'))
        max_depth = None
        max_mag = None
        avg_depth = None
        count = None
        for elem in result: 
            max_depth = elem[0] 
            max_mag = elem[1] 
            avg_depth = elem[2]
            count = elem[3]

        
        return max_depth, max_mag, avg_depth, count
    
    @classmethod
    def add_earthquake(self, session, eq):
        earthquake = Earthquake()
        self.set_earthquake_data(earthquake, eq)
        session.add(earthquake)
        session.commit()
        return earthquake

    @classmethod
    def edit_earthquake(self, session, eq):
        # print(eq['id'], flush=True)
        earthquake = session.query(self).filter(Earthquake.id == eq['id']).first()
        self.set_earthquake_data(earthquake, eq)

        session.commit()
        return earthquake
    
    @classmethod
    def delete_earthquake_by_id(self, session, id):
        obj = session.query(self).filter_by(id=id).one()
        session.delete(obj)
        session.commit()
        return obj
    
    @classmethod
    def set_earthquake_data(self, earthquake, eq):
        earthquake.id = eq['id']
        earthquake.date = eq['date']
        earthquake.time = eq['time']
        earthquake.latitude = eq['latitude']
        earthquake.longitude = eq['longitude']
        earthquake.type = "Earthquake"
        earthquake.depth = eq['depth']
        earthquake.depth_error = eq['depth_error']
        earthquake.depth_seismic_stations = eq['depth_seismic_stations']
        earthquake.magnitude = eq['magnitude']
        earthquake.magnitude_error = eq['magnitude_error']
        earthquake.magnitude_seismic_stations = eq['magnitude_seismic_stations']
        earthquake.azimuthal_gap = eq['azimuthal_gap']
        earthquake.horizontal_distance = eq['horizontal_distance']
        earthquake.horizontal_error = eq['horizontal_error']
        earthquake.root_mean_square = eq['root_mean_square']
        earthquake.source = eq['source']
        earthquake.location_source = eq['location_source']
        earthquake.magnitude_source = eq['magnitude_source']
        earthquake.status = eq['status']

#### USER MODEL ####
class User(Base):
    __tablename__ = 'users'

    id = Column(Numeric, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    pwhash = Column(Text, unique=False, nullable=False)

    @classmethod
    def register(self, session, username, password):
        hash = generate_password_hash(password)
        new_user = User(username=username, pwhash=hash)
        session.add(new_user)
        session.commit()
        return new_user 
    
    @classmethod
    def login(self, session, username, password):
        user = session.query(self).filter(User.username == username).first()
        if not user or not check_password_hash(user.pwhash, password):
            return
        
        token = jwt.encode(
                {"user_id": user.id},
                os.environ.get('SECRET'),
                algorithm="HS256"
            )

        return user, token

    @classmethod
    def get_by_id(self, session, id):
        user = session.query(self).filter(User.id == id).first()
        return user
