from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

projects_db = []

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "project-service"})

@app.route("/projects", methods=["GET"])
def list_projects():
    return jsonify({"projects": projects_db, "count": len(projects_db)})

@app.route("/projects", methods=["POST"])
def create_project():
    data = request.get_json()
    if not data or "name" not in data:
        return jsonify({"error": "Nom du projet requis"}), 400
    project = {
        "id": len(projects_db) + 1,
        "name": data["name"],
        "description": data.get("description", ""),
        "owner": data.get("owner", "unknown"),
        "members": data.get("members", []),
        "created_at": datetime.now().isoformat()
    }
    projects_db.append(project)
    return jsonify({"message": "Projet créé", "project": project}), 201

@app.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    project = next((p for p in projects_db if p["id"] == project_id), None)
    if not project:
        return jsonify({"error": "Projet non trouvé"}), 404
    return jsonify(project)

@app.route("/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    global projects_db
    project = next((p for p in projects_db if p["id"] == project_id), None)
    if not project:
        return jsonify({"error": "Projet non trouvé"}), 404
    projects_db = [p for p in projects_db if p["id"] != project_id]
    return jsonify({"message": "Projet supprimé"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)