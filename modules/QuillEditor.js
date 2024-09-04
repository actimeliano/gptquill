export class QuillEditor {
    constructor(selector) {
        this.quill = new Quill(selector, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    ['link', 'blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }]
                ]
            }
        });
    }

    onSelectionChange(callback) {
        this.quill.on('selection-change', callback);
    }

    highlightSelection(range) {
        this.removeHighlights();
        this.quill.formatText(range.index, range.length, 'background', 'orange');
    }

    removeHighlights() {
        this.quill.formatText(0, this.quill.getLength(), 'background', false);
    }

    // ... other methods
}