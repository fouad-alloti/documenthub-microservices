from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "/app/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Stockage en mémoire (pas besoin de DB pour commencer)
files_db = []

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "file-service"})

@app.route("/files", methods=["GET"])
def list_files():
    return jsonify({"files": files_db, "count": len(files_db)})

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "Aucun fichier envoyé"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Nom de fichier vide"}), 400
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    file_info = {
        "id": len(files_db) + 1,
        "name": file.filename,
        "path": filepath,
        "uploaded_at": datetime.now().isoformat(),
        "size": os.path.getsize(filepath)
    }
    files_db.append(file_info)
    return jsonify({"message": "Fichier uploadé", "file": file_info}), 201

@app.route("/files/<int:file_id>", methods=["GET"])
def get_file(file_id):
    file = next((f for f in files_db if f["id"] == file_id), None)
    if not file:
        return jsonify({"error": "Fichier non trouvé"}), 404
    return jsonify(file)

@app.route("/files/<int:file_id>", methods=["DELETE"])
def delete_file(file_id):
    global files_db
    file = next((f for f in files_db if f["id"] == file_id), None)
    if not file:
        return jsonify({"error": "Fichier non trouvé"}), 404
    files_db = [f for f in files_db if f["id"] != file_id]
    return jsonify({"message": "Fichier supprimé"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False, threaded=True)