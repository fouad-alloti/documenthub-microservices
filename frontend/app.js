// Configuration API
const API_BASE_URL = 'http://localhost';

// Services Health Check
async function checkServicesHealth() {
    const services = ['file-service', 'project-service', 'audit-service'];
    const endpoints = ['/files', '/projects', '/logs'];

    for (let i = 0; i < services.length; i++) {
        try {
            const response = await fetch(API_BASE_URL + endpoints[i]);
            const statusElement = document.getElementById(services[i] + 'Status');
            if (response.ok) {
                statusElement.textContent = '🟢 En ligne';
                statusElement.className = 'status-text online';
            } else {
                statusElement.textContent = '🔴 Erreur';
                statusElement.className = 'status-text offline';
            }
        } catch (error) {
            const statusElement = document.getElementById(services[i] + 'Status');
            statusElement.textContent = '🔴 Hors ligne';
            statusElement.className = 'status-text offline';
        }
    }
}

// File Service Functions
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        showStatus('uploadStatus', 'Veuillez choisir un fichier', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(API_BASE_URL + '/files', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showStatus('uploadStatus', 'Fichier uploadé avec succès!', 'success');
            fileInput.value = '';
            loadFiles();
        } else {
            showStatus('uploadStatus', 'Erreur lors de l\'upload', 'error');
        }
    } catch (error) {
        showStatus('uploadStatus', 'Erreur réseau: ' + error.message, 'error');
    }
}

async function loadFiles() {
    try {
        const response = await fetch(API_BASE_URL + '/files');
        const data = await response.json();

        const filesList = document.getElementById('filesList');
        filesList.innerHTML = '';

        if (data.files.length === 0) {
            filesList.innerHTML = '<p class="loading">Aucun fichier uploadé</p>';
            return;
        }

        data.files.forEach(file => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = 
                <div class="list-item-info">
                    <h4></h4>
                    <p>ID:  | Taille:  KB</p>
                    <p>Uploadé: </p>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-danger" onclick="deleteFile()">Supprimer</button>
                </div>
            ;
            filesList.appendChild(item);
        });
    } catch (error) {
        document.getElementById('filesList').innerHTML = '<p class="loading">Erreur de chargement</p>';
    }
}

async function deleteFile(fileId) {
    try {
        const response = await fetch(API_BASE_URL + '/files/' + fileId, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadFiles();
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Project Service Functions
async function createProject(event) {
    event.preventDefault();

    const name = document.getElementById('projectName').value;
    const description = document.getElementById('projectDesc').value;
    const owner = document.getElementById('projectOwner').value;

    try {
        const response = await fetch(API_BASE_URL + '/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, owner })
        });

        if (response.ok) {
            showStatus('projectStatus', 'Projet créé avec succès!', 'success');
            document.getElementById('projectName').value = '';
            document.getElementById('projectDesc').value = '';
            document.getElementById('projectOwner').value = '';
            loadProjects();
        } else {
            showStatus('projectStatus', 'Erreur lors de la création', 'error');
        }
    } catch (error) {
        showStatus('projectStatus', 'Erreur réseau: ' + error.message, 'error');
    }
}

async function loadProjects() {
    try {
        const response = await fetch(API_BASE_URL + '/projects');
        const data = await response.json();

        const projectsList = document.getElementById('projectsList');
        projectsList.innerHTML = '';

        if (data.projects.length === 0) {
            projectsList.innerHTML = '<p class="loading">Aucun projet créé</p>';
            return;
        }

        data.projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = 
                <div class="list-item-info">
                    <h4></h4>
                    <p></p>
                    <p>Propriétaire:  | Créé: </p>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-danger" onclick="deleteProject()">Supprimer</button>
                </div>
            ;
            projectsList.appendChild(item);
        });
    } catch (error) {
        document.getElementById('projectsList').innerHTML = '<p class="loading">Erreur de chargement</p>';
    }
}

async function deleteProject(projectId) {
    try {
        const response = await fetch(API_BASE_URL + '/projects/' + projectId, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadProjects();
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Audit Service Functions
async function addLog(event) {
    event.preventDefault();

    const action = document.getElementById('logAction').value;
    const user = document.getElementById('logUser').value;
    const service = document.getElementById('logService').value;
    const details = document.getElementById('logDetails').value;

    try {
        const response = await fetch(API_BASE_URL + '/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, user, service, details })
        });

        if (response.ok) {
            showStatus('auditStatus', 'Log enregistré avec succès!', 'success');
            document.getElementById('logAction').value = '';
            document.getElementById('logUser').value = '';
            document.getElementById('logService').value = '';
            document.getElementById('logDetails').value = '';
            loadLogs();
        } else {
            showStatus('auditStatus', 'Erreur lors de l\'enregistrement', 'error');
        }
    } catch (error) {
        showStatus('auditStatus', 'Erreur réseau: ' + error.message, 'error');
    }
}

async function loadLogs() {
    try {
        const response = await fetch(API_BASE_URL + '/logs');
        const data = await response.json();

        const logsList = document.getElementById('logsList');
        logsList.innerHTML = '';

        if (data.logs.length === 0) {
            logsList.innerHTML = '<p class="loading">Aucun log enregistré</p>';
            return;
        }

        data.logs.slice().reverse().forEach(log => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = 
                <div class="list-item-info">
                    <h4></h4>
                    <p>Utilisateur:  | Service: </p>
                    <p></p>
                    <p>Timestamp: </p>
                </div>
            ;
            logsList.appendChild(item);
        });
    } catch (error) {
        document.getElementById('logsList').innerHTML = '<p class="loading">Erreur de chargement</p>';
    }
}

// Helper Functions
function showStatus(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = 'status show ' + type;
    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkServicesHealth();
    loadFiles();
    loadProjects();
    loadLogs();
    
    // Refresh tous les 10 secondes
    setInterval(checkServicesHealth, 10000);
});
