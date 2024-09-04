# GPT-4 Mini Text Editor with Version Control

This project is a web-based text editor that integrates GPT-4 Mini for intelligent text editing and includes version control functionality. It's built using Flask for the backend, and JavaScript with Quill.js for the frontend.

## Features

- Rich text editing with Quill.js
- GPT-4 Mini integration for AI-assisted editing
- Version control system
- Undo/Redo functionality
- Floating action buttons for edit approval, redo, and cancel
- Responsive design with Tailwind CSS

## Prerequisites

- Python 3.7+
- Node.js and npm (for frontend development)
- OpenAI API key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/gpt4-mini-text-editor.git
   cd gpt4-mini-text-editor
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set up your OpenAI API key:
   ```
   export OPENAI_API_KEY='your-api-key-here'
   ```

4. Install frontend dependencies:
   ```
   npm install
   ```

## Usage

1. Start the Flask server:
   ```
   python main.py
   ```

2. Open a web browser and navigate to `http://localhost:8000`

3. Use the text editor to write and edit content. Select text to use the GPT-4 Mini editing feature.

## Project Structure

- `main.py`: Flask server and main application logic
- `version_control.py`: Version control backend logic
- `index.html`: Main HTML file
- `script.js`: Main JavaScript file
- `styles.css`: Custom CSS styles
- `modules/`: JavaScript modules for various components
  - `QuillEditor.js`: Quill editor setup
  - `PopupMenu.js`: Popup menu for GPT prompts
  - `FloatingButtons.js`: Floating action buttons
  - `GPTIntegration.js`: GPT-4 Mini integration
  - `VersionControl.js`: Version control frontend logic

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.