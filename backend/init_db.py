import geopandas as gpd
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool  # Import NullPool to prevent connection pooling interference

conn = psycopg2.connect(
        host="localhost",
        database="ses_interview_flask_db",
        user='sesinterviewuser',
        password='sespassword')

# Open a cursor to perform database operations
cur = conn.cursor()

table_creation_query = """
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE,
    pwhash TEXT
);
"""
cur.execute(table_creation_query)
print('Created user table')

conn.commit()
hashed_test_password = "scrypt:32768:8:1$mjXdus1VQdEHMO3E$de6167fe7fded87aa24e0066245f1620a08aa2d973f220e3b1f4c15db32c8381d4c4efefd0e2d2c99f8b11dbed1851f6abeda0c97b850ef5a8d020aa3b36b863"
test_user_creation_query = f"INSERT INTO users (username, pwhash) VALUES ('test', '{hashed_test_password}');"
print('Added test user')

cur.execute(test_user_creation_query)
conn.commit()

# Define the GeoJSON file path
geojson_file = './backend/Earthquakes.geojson'

# Read GeoJSON file into a GeoDataFrame
gdf = gpd.read_file(geojson_file)

# Connect to the PostgreSQL database using SQLAlchemy
engine = create_engine('postgresql://', creator=lambda: conn, poolclass=NullPool)

# Save the GeoDataFrame to the PostgreSQL database
gdf.to_postgis(name='earthquake_data', con=engine, if_exists='replace', index=False)
print('Created earthquake data table')

cur.close()
conn.close()