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

    def test_get_overview_french(self):
        response = self.client.get('/apis/get_overview?lang=fr')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('Étudiant', data['job_description'])

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

    def test_get_cv_language_codes(self):
        for code in ['en', 'fr']:
            response = self.client.get(f'/apis/get_cv?lang={code}')
            self.assertEqual(response.status_code, 200, f"Failed for code {code}")
            self.assertEqual(response.content_type, 'application/pdf')

    def test_get_cv_missing_language(self):
        response = self.client.get('/apis/get_cv')
        self.assertEqual(response.status_code, 400)

    def test_translations_default_en(self):
        response = self.client.get('/apis/translations')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['language'], 'en')
        self.assertIn('translations', data)
        self.assertEqual(data['translations']['nav']['portfolio'], 'Portfolio')
        self.assertEqual(data['translations']['hero']['download_cv'], 'Download CV')

    def test_translations_french(self):
        response = self.client.get('/apis/translations?lang=fr')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['language'], 'fr')
        self.assertIn('translations', data)
        self.assertEqual(data['translations']['nav']['side_quests'], 'Missions secondaires')
        self.assertEqual(data['translations']['hero']['download_cv'], 'Télécharger le CV')

    def test_translations_path_param(self):
        response = self.client.get('/apis/translations/fr')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['language'], 'fr')
        self.assertEqual(data['translations']['nav']['side_quests'], 'Missions secondaires')

    def test_translations_fallback_on_unsupported(self):
        response = self.client.get('/apis/translations?lang=unsupported_lang')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['language'], 'en')
        self.assertEqual(data['translations']['hero']['download_cv'], 'Download CV')

    def test_translation_files_keys_match(self):
        backend_dir = os.path.join(os.path.dirname(__file__), 'backend', 'files')
        en_path = os.path.join(backend_dir, 'profil_overview_eng.json')
        fr_path = os.path.join(backend_dir, 'profil_overview_eng_french.json')

        self.assertTrue(os.path.exists(en_path), f"Missing {en_path}")
        self.assertTrue(os.path.exists(fr_path), f"Missing {fr_path}")

        with open(en_path, 'r', encoding='utf-8') as f:
            en_data = json.load(f)
        with open(fr_path, 'r', encoding='utf-8') as f:
            fr_data = json.load(f)

        def verify_keys(d1, d2, path=''):
            keys1 = set(d1.keys())
            keys2 = set(d2.keys())
            self.assertEqual(keys1, keys2, f"Key mismatch at '{path}': in EN only {keys1 - keys2}, in FR only {keys2 - keys1}")
            for k in keys1:
                v1 = d1[k]
                v2 = d2[k]
                subpath = f"{path}.{k}" if path else k
                self.assertEqual(type(v1), type(v2), f"Type mismatch at '{subpath}'")
                if isinstance(v1, dict):
                    verify_keys(v1, v2, subpath)

        verify_keys(en_data, fr_data)

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
            'app.js', 'api.js', 'state.js', 'router.js', 'i18n.js', 'matrix-canvas.js',
            'templates/normal-view.js', 'templates/devmode-view.js', 'templates/matrix-view.js'
        ]
        for js in js_files:
            response = self.client.get(f'/static/js/{js}')
            self.assertEqual(response.status_code, 200, f"Failed to load /static/js/{js}")

if __name__ == '__main__':
    unittest.main()
