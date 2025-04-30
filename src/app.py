from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

translator = Translator()

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()

    if not data or 'text' not in data or 'target' not in data:
        return jsonify({'error': 'Missing parameters'}), 400

    text = data['text']
    target_lang = data['target']

    try:
        translated = translator.translate(text, dest=target_lang)
        return jsonify({'translatedText': translated.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
