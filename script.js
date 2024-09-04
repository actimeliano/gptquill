import { QuillEditor } from './modules/QuillEditor.js';
import { PopupMenu } from './modules/PopupMenu.js';
import { FloatingButtons } from './modules/FloatingButtons.js';
import { GPTIntegration } from './modules/GPTIntegration.js';
import { VersionControl } from './modules/VersionControl.js';

document.addEventListener('DOMContentLoaded', function() {
    const quillEditor = new QuillEditor('#editor');
    const versionControl = new VersionControl(quillEditor.quill);
    const popupMenu = new PopupMenu('#popup-menu');
    const floatingButtons = new FloatingButtons();
    const gptIntegration = new GPTIntegration();

    let selectedRange = null;
    let isSelectionActive = false;

    quillEditor.onSelectionChange((range, oldRange, source) => {
        if (range && range.length > 0) {
            selectedRange = range;
            quillEditor.highlightSelection(range);
            popupMenu.show(quillEditor.quill.getBounds(range.index, range.length));
            isSelectionActive = true;
        } else if (!popupMenu.contains(document.activeElement) && !isSelectionActive) {
            quillEditor.removeHighlights();
            popupMenu.hide();
        }
    });

    popupMenu.onEditRequest((prompt) => {
        const selectedText = quillEditor.quill.getText(selectedRange.index, selectedRange.length);
        gptIntegration.editWithGPT(selectedText, prompt, selectedRange)
            .then(editedText => {
                quillEditor.quill.deleteText(selectedRange.index, selectedRange.length);
                quillEditor.quill.insertText(selectedRange.index, editedText, 'api');
                quillEditor.removeHighlights();
                popupMenu.hide();
                // Use showAfterEdit instead of show
                floatingButtons.showAfterEdit(quillEditor.quill.getBounds(selectedRange.index, editedText.length));
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    });

    floatingButtons.onApprove(() => {
        gptIntegration.approveEdit()
            .then(() => {
                // No need to hide here, as it's handled automatically
                versionControl.saveVersion();
            })
            .catch(error => console.error('Error:', error));
    });

    floatingButtons.onRedo(() => {
        gptIntegration.redoEdit()
            .then(text => {
                quillEditor.quill.deleteText(selectedRange.index, selectedRange.length);
                quillEditor.quill.insertText(selectedRange.index, text, 'api');
            })
            .catch(error => console.error('Error:', error));
    });

    floatingButtons.onCancel(() => {
        gptIntegration.cancelEdit()
            .then(text => {
                quillEditor.quill.deleteText(selectedRange.index, selectedRange.length);
                quillEditor.quill.insertText(selectedRange.index, text, 'api');
                // No need to hide here, as it's handled automatically
                quillEditor.removeHighlights();
            })
            .catch(error => console.error('Error:', error));
    });

    document.addEventListener('click', function(e) {
        if (!popupMenu.contains(e.target) && !quillEditor.quill.root.contains(e.target)) {
            quillEditor.removeHighlights();
            popupMenu.hide();
            isSelectionActive = false;
        }
    });

    versionControl.loadVersionsFromServer();
});