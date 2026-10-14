import unittest
import json
import os
from app import app

class PortfolioTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()

    def test_get_overview_route(self):
        response = self.client.get('/apis/get_overview')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('name', data)
        self.assertIn('job_description', data)
        self.assertIn('resume', data)
        self.assertIn('experiences', data)
        self.assertIn('projects', data)
        self.assertIn('skills', data)
        self.assertIn('education', data)
        self.assertIn('contact', data)
        self.assertIn('volunteer', data)

    def test_get_overall_route(self):
        response = self.client.get('/apis/get_overall')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['name'], "Oussama zmitri")

    def test_get_cv_english(self):
        response = self.client.get('/apis/get_cv?langauge=english')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/pdf')
        self.assertGreater(len(response.data), 1000)

    def test_get_cv_french(self):
        response = self.client.get('/apis/get_cv?langauge=french')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/pdf')
        self.assertGreater(len(response.data), 1000)

    def test_get_cv_missing_language(self):
        response = self.client.get('/apis/get_cv')
        self.assertEqual(response.status_code, 400)

    def test_page_routes(self):
        for route in ['/', '/side-quests', '/writing']:
            response = self.client.get(route)
            self.assertEqual(response.status_code, 200, f"Route {route} failed")
            html = response.get_data(as_text=True)
            self.assertIn('Oussama Zmitri', html)
            self.assertIn('data-template="normal"', html)

    def test_static_css_assets(self):
        css_files = ['tokens.css', 'base.css', 'normal.css', 'devmode.css', 'matrix.css']
        for css in css_files:
            response = self.client.get(f'/static/css/{css}')
            self.assertEqual(response.status_code, 200, f"Failed to load /static/css/{css}")
            self.assertIn('text/css', response.content_type)

    def test_static_js_assets(self):
        js_files = [
            'app.js', 'api.js', 'state.js', 'router.js', 'matrix-canvas.js',
            'templates/normal-view.js', 'templates/devmode-view.js', 'templates/matrix-view.js'
        ]
        for js in js_files:
            response = self.client.get(f'/static/js/{js}')
            self.assertEqual(response.status_code, 200, f"Failed to load /static/js/{js}")

if __name__ == '__main__':
    unittest.main()
