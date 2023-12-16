import json

from tests.BaseCase import BaseCase

class TestUserLogin(BaseCase):

    def test_successful_login(self):
        print('Running test: test_successful_login')
        username = "test"
        password = "test"
        user_payload = json.dumps({
            "username": username,
            "password": password
        })

        response = self.app.post('/login', headers={"Content-Type": "application/json"}, data=user_payload)
        login_token = response.json['token']

        self.assertTrue(len(login_token) > 0)
        self.assertEqual(login_token[:2], "ey")
        self.assertEqual(201, response.status_code)

        