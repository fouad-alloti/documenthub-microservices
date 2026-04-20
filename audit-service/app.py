from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

audit_logs = []

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "audit-service"})

@app.route("/logs", methods=["GET"])
def list_logs():
    return jsonify({"logs": audit_logs, "count": len(audit_logs)})

@app.route("/logs", methods=["POST"])
def add_log():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Données manquantes"}), 400
    log = {
        "id": len(audit_logs) + 1,
        "action": data.get("action", "unknown"),
        "user": data.get("user", "anonymous"),
        "service": data.get("service", "unknown"),
        "details": data.get("details", ""),
        "timestamp": datetime.now().isoformat()
    }
    audit_logs.append(log)
    return jsonify({"message": "Log ajouté", "log": log}), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003, debug=False)