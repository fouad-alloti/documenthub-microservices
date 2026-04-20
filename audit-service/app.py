from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

audit_logs = []

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'audit-service'})

@app.route('/logs', methods=['GET'])
def list_logs():
    return jsonify({'logs': audit_logs, 'count': len(audit_logs)})

@app.route('/logs', methods=['POST'])
def add_log():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Donnees manquantes'}), 400
    log = {
        'id': len(audit_logs) + 1,
        'action': data.get('action', 'unknown'),
        'user': data.get('user', 'anonymous'),
        'service': data.get('service', 'unknown'),
        'details': data.get('details', ''),
        'timestamp': datetime.now().isoformat()
    }
    audit_logs.append(log)
    return jsonify({'message': 'Log ajoute', 'log': log}), 201

@app.route('/logs/<int:log_id>', methods=['GET'])
def get_log(log_id):
    log = next((l for l in audit_logs if l['id'] == log_id), None)
    if not log:
        return jsonify({'error': 'Log non trouve'}), 404
    return jsonify(log)

if __name__ == '__main__':
    print('Starting audit-service on port 5003...')
    app.run(host='0.0.0.0', port=5003, debug=False)
