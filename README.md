# SES Interview Project
      root
      ├── frontend
      │   ├── app/
      │   ├── assets/
      │   ├── main.ts
      │   ├── index.html
      │   ├── styles.css
      │   ├── favicon.ico
      ├── backend
      │   ├── models.py
      │   ├── app.py
      │   ├── .env
      │   ├── db_setup.sql
      │   ├── db_cleanup.sql
      │   ├── Earthquakes.geojson
      ├── node_modules/
      ├── angular.json
      ├── tsconfig.json
      ├── tsconfig.spec.json
      ├── tsconfig.app.json
      └── package.json

## Backend
Backend is a REST API developed in Python3 utilizing Flask API.
Default port for server is port 5000. You can change the DB URL in `./backend/.env` file
### Setup
1. Install Python3 and check version. Set alias `python` to `python3` if needed. 
    ```
    python --version
    ```
1. Create and activate virtaul environment
    ```
    python -m venv <name>
    source ./<name>/Scripts/activate # Windows
    source ./<name>/bin/activate     # MacOS / Linux
    ```
1. Install dependencies from requirements.txt file from root directory (may take a minute)
    ```
    pip install -r ./backend/requirements.txt
    ```
1. Run backend server (from root directory)
    ```
    npm run backend 
    ```
    or run directly
    ```
    python ./backend/app.py
    ```

## Frontend
Frontend was developed using Angular, TypeScript, leaflet, and Material UI libraries
Default port for server is port 4200
### Setup 
1. Install Node.js and check version
    ```
    node --version
    ```
1. Install dependencies (from root directory)
    ```
    npm install
    ```
1. Start frontend (from root directory)
    ```
    npm start
    ```
1. Access frontend via browser at `http://localhost:4200`

## Database
Database is PostgreSQL with PostGIS extension.
Default port for server is port 5432
### Setup
1. Install PostgreSQL and check version
    ```
    psql --version
    ```
1. Install PostGIS extension (available using StackBuilder under `Spatial Extensions > PostGIS Bundle for PostgresSQL`). If using MacOS PostGIS is included with Postgres.app installation.
1. Run SQL script to initialize database and database user. Example using default postgres user.
    ```
    psql -U postgres -f ./backend/db_setup.sql 
    ```
1. Now run the db_init.py script from the root folder to populate data into the database.
 
    *ensure correct python virtual environment is activated if using one
    ```
    python ./backend/init_db.py
    ```
### Database Cleanup
To clean up and remove data from database run the following SQL script:

  ```
  psql -U postgres -f ./backend/db_cleanup.sql
  ```

### Start / Stop Database
Use pg_ctl to start and stop database. Example using default postgres user.
  ```
  pg_ctl -U postgres -D <path to data> start
  pg_ctl -U postgres -D <path to data> stop
  ```

