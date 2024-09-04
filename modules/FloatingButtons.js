export class FloatingButtons {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'floating-buttons';
        this.element.innerHTML = `
            <button class="approve">✓</button>
            <button class="redo">↺</button>
            <button class="cancel">✕</button>
        `;
        document.body.appendChild(this.element);

        this.approveCallback = null;
        this.redoCallback = null;
        this.cancelCallback = null;

        this.element.querySelector('.approve').addEventListener('click', () => this.approveCallback?.());
        this.element.querySelector('.redo').addEventListener('click', () => this.redoCallback?.());
        this.element.querySelector('.cancel').addEventListener('click', () => this.cancelCallback?.());

        // Initially hide the buttons
        this.hide();
    }

    show(bounds) {
        this.element.style.display = 'flex';
        this.element.style.top = `${bounds.bottom + 10}px`;
        this.element.style.left = `${bounds.left}px`;
    }

    hide() {
        this.element.style.display = 'none';
    }

    onApprove(callback) {
        this.approveCallback = callback;
    }

    onRedo(callback) {
        this.redoCallback = callback;
    }

    onCancel(callback) {
        this.cancelCallback = callback;
    }

    showAfterEdit(bounds) {
        this.show(bounds);
        // Automatically hide after a timeout (e.g., 10 seconds)
        setTimeout(() => this.hide(), 10000);
    }
}