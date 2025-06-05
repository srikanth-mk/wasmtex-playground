# WASMTeX-playground

A web-based LaTeX editor and compiler that allows users to write, edit, and compile LaTeX documents in real-time with PDF preview. Built with Docker for easy deployment and includes support for image uploads, custom LaTeX datasets, and pre-loaded default assets.

## Inspiration & Enhancements

This work is **inspired by SwiftLaTeX**, an innovative browser-based LaTeX editor. We've built upon the foundation of SwiftLaTeX and added several additional features to enhance the user experience:

### Key Enhancements Over SwiftLaTeX:
- **Enhanced Scroll Mode / Non Stop Mode**: Improved PDF viewing with better scroll handling and navigation
- **Enhanced Image Support**: Better integration for .jpg image uploads and processing
- **Default Asset Management**: Automatic loading of common LaTeX packages, styles, and resources from ZIP archives
- **Improved Console Output**: More detailed compilation logs and error reporting
- **Optimized Docker Deployment**: Streamlined containerization for easier deployment and scaling

## Demo

![WASMTeX Playground Demo](demo/wasmtex-demo.gif)

*Live demonstration of LaTeX editing and compilation in the browser*

## Features

- **Real-time LaTeX editing** with syntax highlighting
- **Instant PDF compilation** and preview
- **Image support** - Upload and include .jpg images in your LaTeX documents
- **Dataset upload** - Upload entire folders containing .tex and .jpg files
- **Default Assets System** - Automatically loads common LaTeX packages, styles, and resources
- **Download compiled PDFs** directly from the browser
- **Responsive design** with split-screen editor and PDF viewer
- **Default template** - Start coding immediately without file uploads

## Prerequisites

- Docker
- Docker Compose
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/srikanth-mk/wasmtex-playground.git
cd wasmtex-playground
```

### 2. Build and Run with Docker Compose

```bash
docker-compose up --build
```

This will start two services:
- **LaTeX Compiler Service** on port `5002`
- **Static File Server** on port `8002`

### 3. Access the Application

Open your web browser and navigate to:
```
http://localhost:8002
```

## Project Structure

```
wasmtex-playground/
├── texlive-ondemand/                                             # LaTeX compilation service
│   ├── Dockerfile
│   ├── wsgi.py
│   ├── requirements.txt
│   └── neopdftex.fmt                                             # Pre-compiled LaTeX format
│   └── app.py
|   └── app.cer
│   └── sign.bat
│   └── pykpathsea_pdftex.cpython-38-x86_64-linux-gnu.so          # Pre-compiled module
│   └── pykpathsea_pdftex.c
│   └── kpathsea_pdftex_setup.py
├── docker-compose.yml
├── index.html                 # Main LaTeX editor interface
├── PdfTeXEngine.js            # LaTeX compilation engine
├── neopdftex.wasm             # Pre-compiled from wasm-builder
├── neopdftex.js               # Pre-compiled from wasm-builder
├── default-assets.zip         # Default LaTeX packages and resources (optional)
└── README.md
```

## Usage

### Basic Usage

1. **Start typing LaTeX code** in the left editor panel
2. **Click "Compile"** to generate the PDF
3. **View the PDF** in the right panel
4. **Download** the compiled PDF using the "Download PDF" button

### Using Default Template

The editor comes with a default "Hello World" LaTeX template:
```latex
\documentclass{article}
\usepackage{graphicx}
\begin{document}
Hello World!
\end{document}
```

You can modify this template and compile it directly without uploading any files.

### Default Assets System

The application automatically loads common LaTeX resources from a `default-assets.zip` file when available:

#### What are Default Assets?
- **LaTeX packages** (.sty files)
- **Document classes** (.cls files)
- **Bibliography files** (.bib files)
- **Images and graphics** (.jpg, .png, .pdf, .eps, .svg)
- **Additional LaTeX templates** (.tex files)

#### How Default Assets Work:
1. **Automatic Loading**: When the page loads, the system automatically fetches and extracts `default-assets.zip`
2. **Status Indicator**: The asset status shows loading progress and success/failure
3. **Memory Integration**: All assets are loaded into the LaTeX compiler's memory filesystem
4. **Reload Option**: Use "Reload Default Assets" button to refresh assets

#### Setting Up Default Assets:

1. **Create a ZIP file** named `default-assets.zip` containing your common LaTeX resources:
   ```
   default-assets.zip
   ├── custom.sty          # Custom style files
   ├── company-logo.png    # Common images
   ├── references.bib      # Bibliography files
   ├── template.tex        # Template files
   └── fonts/
       └── custom-font.ttf # Font files
   ```

2. **Place the ZIP file** in the same directory as `index.html`

3. **Access in LaTeX**: All files are available by filename in your LaTeX documents:
   ```latex
   \documentclass{article}
   \usepackage{custom}
   \includegraphics{company-logo.png}
   \bibliography{references}
   \begin{document}
   Your content here...
   \end{document}
   ```

#### Asset Status Indicators:
- **Loading...**: Assets are being fetched and extracted
- **✓ Loaded X files from ZIP**: Successfully loaded assets
- **✗ Failed to load ZIP**: Error occurred (check console for details)

### Uploading LaTeX Projects

1. **Click "Choose Files"** and select a folder containing:
   - `.tex` files (LaTeX source)
   - `.jpg` files (images to include)
2. **The main .tex file** will be automatically loaded into the editor
3. **All images** will be available for inclusion in your LaTeX document
4. **Click "Compile"** to generate the PDF

### Advanced Features

- **Create Format**: Click "Create Format" to optimize compilation speed
- **Console Output**: View compilation logs and error messages
- **Real-time Editing**: Make changes and recompile instantly
- **Asset Management**: Monitor and reload default assets as needed

## Docker Services

### LaTeX Compiler Service (`texlive-ondemand`)

- **Port**: 5002
- **Purpose**: Handles LaTeX compilation using TeXLive
- **Features**: 
  - Full TeXLive installation
  - Python-based compilation service
  - Pre-compiled format for faster processing

### Static File Server

- **Port**: 8002
- **Purpose**: Serves the web interface and static files
- **Features**:
  - Lightweight Python HTTP server
  - Read-only volume mounting
  - Auto-restart capability
  - Serves default-assets.zip when available

## Development

### Local Development Setup

1. **Clone the repository**:
```bash
git clone https://github.com/srikanth-mk/wasmtex-playground.git
cd wasmtex-playground
```

2. **Start the services**:
```bash
docker-compose up --build
```

3. **Make changes** to the HTML/JavaScript files
4. **Refresh the browser** to see changes (static files are served directly)

### Creating Default Assets

To create your own default assets package:

1. **Create a folder** with your LaTeX resources:
   ```bash
   mkdir default-assets
   cd default-assets
   # Add your .sty, .cls, .bib, image files, etc.
   ```

2. **Create the ZIP file**:
   ```bash
   zip -r ../default-assets.zip .
   ```

3. **Place in project root** alongside `index.html`

4. **Test the loading** by opening the application and checking the asset status

### Modifying the LaTeX Service

If you need to modify the LaTeX compilation service:

1. **Edit files** in the `texlive-ondemand/` directory
2. **Rebuild the container**:
```bash
docker-compose up --build texlive-ondemand
```

## Compile Engines by yourself
wasmtex compiles PdfTeX engines into WebAssembly. We recommend the pdfTeX engine as it supports UTF-8 and Opentype fonts out of box. As a result, the locale linebreaking may not function as expected. This issue is easy to fix: we just need to initialize the ICU library with the correct dataset.  If you just need to handle English, the PdfTeX is also a nice option. It is less compilcated, thus faster and less buggy.

1. Get the emsdk repo
```
git clone https://github.com/emscripten-core/emsdk.git
```
2. Enter that directory
```
cd emsdk
```
3. Fetch the latest version of the emsdk (not needed the first time you clone)
```
git pull
```
4. Download and install the 3.1.46 SDK tools.
```
./emsdk install 3.1.46
```
5. Make the latest" SDK "active" for the current user. (writes .emscripten file)
```
./emsdk activate 3.1.46
```
6. Activate PATH and other environment variables in the current terminal
```
source ./emsdk_env.sh
```
7. Compile PdfTeX
```
cd wasm-builder/pdftex.wasm
make
```

## Troubleshooting

### Common Issues

**Service not starting**:
- Check if ports 5002 and 8002 are available
- Ensure Docker and Docker Compose are installed and running

**Compilation errors**:
- Check the console output for detailed error messages
- Ensure your LaTeX syntax is correct
- Verify that all referenced images are uploaded or available in default assets

**PDF not displaying**:
- Check browser console for JavaScript errors
- Ensure the LaTeX compilation was successful (status 0 or 1)
- Try refreshing the page

**Default assets not loading**:
- Ensure `default-assets.zip` exists in the same directory as `index.html`
- Check the asset status indicator for error messages
- Verify the ZIP file is not corrupted
- Check browser console for detailed error logs

### Logs

View service logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs texlive-ondemand
docker-compose logs static-server
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Configuration

### Ports

You can modify the ports in `docker-compose.yml`:
- Change `5002:5002` to use a different port for the LaTeX service
- Change `8002:8002` to use a different port for the web interface

### LaTeX Packages

The Docker image includes `texlive-full`, which provides comprehensive LaTeX package support. Additional packages can be included via the default assets system or by modifying the Dockerfile in the `texlive-ondemand/` directory.

### Default Assets Configuration

The default assets system can be customized by:
- Modifying the ZIP file structure and contents
- Adding more file types to the loading logic
- Customizing the asset status display

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including default assets functionality)
5. Submit a pull request

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the console output for error messages
- Check the asset status indicator for loading issues
- Create an issue in the repository

---

**Happy LaTeX editing! 📝✨**