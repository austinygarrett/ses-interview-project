import json

from tests.BaseCase import BaseCase

class TestEarthquake(BaseCase):

    def test_earthquake_add_and_delete(self):
        print('Running test: test_earthquake_add_and_delete')
        username = "test"
        password = "test"
        user_payload = json.dumps({
            "username": username,
            "password": password
        })

        response = self.app.post('/login', headers={"Content-Type": "application/json"}, data=user_payload)
        login_token = response.json['token']
        self.assertEqual(201, response.status_code)
        earthquake_add = json.dumps({
            "id": "TEST123",
            "date": "01/02/03",
            "time": "12:05:11",
            "latitude": 12.345,
            "longitude": -12.234,
            "magnitude": 70.77,
            "depth": 222.2,
            "depth_error": 0.0,
            "depth_seismic_stations": 0.0,
            "magnitude_type": "MW",
            "magnitude_error": 0.0,
            "magnitude_seismic_stations": 0.0,
            "azimuthal_gap": 0.0,
            "horizontal_distance": 0.0,
            "horizontal_error": 0.0,
            "root_mean_square": 0.0,
            "source": "TESTSRC",
            "location_source": "TESTSRC",
            "magnitude_source": "TESTSRC",
            "status": "Automatic"
        })

        response = self.app.post('/earthquakes', headers={"Content-Type": "application/json", "Authorization": "Token " + login_token}, data=earthquake_add)
        self.assertEqual(200, response.status_code)
        self.assertEqual('TEST123', response.json['id'])

        response = self.app.delete('/earthquakes/TEST123', headers={"Content-Type": "application/json", "Authorization": "Token " + login_token})
        self.assertEqual(200, response.status_code)
        self.assertEqual('TEST123', response.json['id'])

    def test_dashboard_data(self):
        print('Running test: test_dashboard_data')
        username = "test"
        password = "test"
        user_payload = json.dumps({
            "username": username,
            "password": password
        })

        response = self.app.post('/login', headers={"Content-Type": "application/json"}, data=user_payload)
        login_token = response.json['token']
        self.assertEqual(201, response.status_code)

        response = self.app.get('/dashboard', headers={"Content-Type": "application/json", "Authorization": "Token " + login_token})
        self.assertEqual(200, response.status_code)
        self.assertTrue(response.json['total'] > 0)
        self.assertTrue(response.json['depthMax'] > 0)
        self.assertTrue(response.json['depthAvg'] > 0)
        self.assertTrue(response.json['magMax'] > 0)