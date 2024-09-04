from flask import Blueprint, request, jsonify

version_control = Blueprint('version_control', __name__)

versions = []
current_version_index = -1

@version_control.route('/sync-versions', methods=['POST'])
def sync_versions():
    global versions, current_version_index
    data = request.json
    versions = data['versions']
    current_version_index = data['currentVersionIndex']
    return jsonify({"status": "success"})

@version_control.route('/get-versions', methods=['GET'])
def get_versions():
    return jsonify({
        "versions": versions,
        "currentVersionIndex": current_version_index
    })