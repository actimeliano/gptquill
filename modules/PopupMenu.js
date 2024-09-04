export class PopupMenu {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.promptInput = this.element.querySelector('#gpt-prompt');
        this.editButton = this.element.querySelector('#edit-gpt-button');
        this.editCallback = null;
    }

    show(bounds) {
        this.element.style.display = 'block';
        this.element.style.top = `${bounds.bottom + 10}px`;
        this.element.style.left = `${bounds.left}px`;
        this.promptInput.focus();
    }

    hide() {
        this.element.style.display = 'none';
    }

    onEditRequest(callback) {
        this.editCallback = callback;
        this.editButton.addEventListener('click', () => this.handleEdit());
        this.promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleEdit();
        });
    }

    handleEdit() {
        if (this.editCallback) {
            this.editCallback(this.promptInput.value);
        }
    }

    contains(element) {
        return this.element.contains(element);
    }
}