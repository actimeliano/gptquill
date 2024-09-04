from flask import Flask, request, jsonify, send_from_directory
from openai import OpenAI
import os
from version_control import version_control

# Set up OpenAI API key
api_key = os.environ.get('OPENAI_API_KEY')

if not api_key:
    print("OpenAI API key not found. Please set the OPENAI_API_KEY environment variable.")
    exit(1)

client = OpenAI(api_key=api_key)

app = Flask(__name__)
app.register_blueprint(version_control)

# Store text versions and edit history
text_versions = {}
edit_history = {}
current_version = {}

def get_gpt4_mini_response(messages):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini-2024-07-18",
            messages=messages
        )
        content = response.choices[0].message.content
        return {"text": content}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    messages = data.get('messages', [])
    session_id = data.get('session_id', '')
    original_text = data.get('original_text', '')
    
    response = get_gpt4_mini_response(messages)
    
    if 'text' in response:
        if session_id not in text_versions:
            text_versions[session_id] = [original_text]
            edit_history[session_id] = []
            current_version[session_id] = 0
        
        text_versions[session_id].append(response['text'])
        edit_history[session_id].append(data.get('user_prompt', ''))
        current_version[session_id] = len(text_versions[session_id]) - 1

    return jsonify(response)

@app.route('/approve', methods=['POST'])
def approve():
    data = request.json
    session_id = data.get('session_id', '')
    if session_id in current_version:
        current_version[session_id] = len(text_versions[session_id]) - 1
        return jsonify({"status": "approved"})
    else:
        return jsonify({"error": "Invalid session ID"}), 400

@app.route('/redo', methods=['POST'])
def redo():
    data = request.json
    session_id = data.get('session_id', '')
    if session_id in current_version:
        current_version[session_id] = 0  # Reset to original version
        response = {
            "text": text_versions[session_id][0],
            "user_prompt": edit_history[session_id][0] if edit_history[session_id] else ""
        }
        return jsonify(response)
    else:
        return jsonify({"error": "Invalid session ID"}), 400

@app.route('/cancel', methods=['POST'])
def cancel():
    data = request.json
    session_id = data.get('session_id', '')
    if session_id in text_versions:
        response = {
            "text": text_versions[session_id][0]  # Always return the original text
        }
        current_version[session_id] = 0  # Reset to the original version
        return jsonify(response)
    else:
        return jsonify({"error": "Invalid session ID"}), 400

if __name__ == "__main__":
    app.run(port=8000, debug=True)