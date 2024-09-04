class VersionControl {
    constructor(quill) {
        this.quill = quill;
        this.versions = [];
        this.currentVersionIndex = -1;
        this.debounceTimeout = null;
        this.setupListeners();
    }

    setupListeners() {
        this.quill.on('text-change', (delta, oldDelta, source) => {
            if (source === 'user') {
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => this.saveVersion(), 1000);
            }
        });

        document.getElementById('undo-button').addEventListener('click', () => this.undo());
        document.getElementById('redo-button').addEventListener('click', () => this.redo());
    }

    saveVersion() {
        const content = this.quill.getContents();
        const timestamp = new Date().toISOString();
        
        // Remove future versions if we're not at the latest version
        if (this.currentVersionIndex < this.versions.length - 1) {
            this.versions = this.versions.slice(0, this.currentVersionIndex + 1);
        }

        this.versions.push({ content, timestamp });
        this.currentVersionIndex = this.versions.length - 1;

        this.syncWithServer();
        this.updateVersionList();
    }

    restoreVersion(index) {
        if (index >= 0 && index < this.versions.length) {
            const version = this.versions[index];
            this.quill.setContents(version.content);
            this.currentVersionIndex = index;
            this.updateVersionList();
        }
    }

    undo() {
        if (this.currentVersionIndex > 0) {
            this.restoreVersion(this.currentVersionIndex - 1);
        }
    }

    redo() {
        if (this.currentVersionIndex < this.versions.length - 1) {
            this.restoreVersion(this.currentVersionIndex + 1);
        }
    }

    syncWithServer() {
        fetch('/sync-versions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                versions: this.versions,
                currentVersionIndex: this.currentVersionIndex
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Versions synced with server');
        })
        .catch(error => {
            console.error('Error syncing versions:', error);
        });
    }

    loadVersionsFromServer() {
        fetch('/get-versions')
        .then(response => response.json())
        .then(data => {
            this.versions = data.versions;
            this.currentVersionIndex = data.currentVersionIndex;
            if (this.versions.length > 0) {
                this.restoreVersion(this.currentVersionIndex);
            }
            this.updateVersionList();
        })
        .catch(error => {
            console.error('Error loading versions:', error);
        });
    }

    updateVersionList() {
        const versionList = document.getElementById('version-list');
        versionList.innerHTML = '';
        this.versions.forEach((version, index) => {
            const li = document.createElement('li');
            li.className = 'cursor-pointer hover:bg-gray-100 p-2 rounded';
            if (index === this.currentVersionIndex) {
                li.className += ' bg-blue-100';
            }
            const date = new Date(version.timestamp);
            li.textContent = `Version ${index + 1} - ${date.toLocaleString()}`;
            li.addEventListener('click', () => this.restoreVersion(index));
            versionList.appendChild(li);
        });
    }
}

// Initialize VersionControl in script.js
document.addEventListener('DOMContentLoaded', function() {
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                ['link', 'blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }]
            ]
        }
    });

    const versionControl = new VersionControl(quill);
    versionControl.loadVersionsFromServer();
});