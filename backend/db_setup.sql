CREATE DATABASE ses_interview_flask_db;
CREATE USER sesinterviewuser WITH PASSWORD 'sespassword';

GRANT ALL PRIVILEGES ON DATABASE ses_interview_flask_db TO sesinterviewuser;
\c ses_interview_flask_db
GRANT ALL ON SCHEMA public TO sesinterviewuser;
CREATE EXTENSION postgis;

