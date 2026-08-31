# ==============================================================================
# PrintBolt High-Fidelity Font & Document Conversion Engine
# Base: Gotenberg 8 (Lightweight LibreOffice & Chromium PDF Microservice)
# Includes: Full Microsoft TrueType Fonts, Windows 10/11 Fonts, & Indian Scripts
# ==============================================================================

FROM gotenberg/gotenberg:8

USER root

# Install software properties, curl, wget, cabextract, fontconfig and core fonts
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    curl \
    wget \
    cabextract \
    fontconfig \
    xfonts-utils \
    fonts-crosextra-carlito \
    fonts-crosextra-caladea \
    fonts-liberation \
    fonts-liberation2 \
    fonts-dejavu \
    fonts-dejavu-core \
    fonts-dejavu-extra \
    fonts-noto \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    fonts-noto-core \
    fonts-noto-extra \
    fonts-noto-ui-core \
    fonts-freefont-ttf \
    fonts-sil-gentium \
    fonts-sil-gentium-basic \
    fonts-roboto \
    fonts-open-sans && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create directory for Windows and Custom TrueType Fonts
RUN mkdir -p /usr/share/fonts/truetype/msttcorefonts /usr/share/fonts/truetype/windows

# Download and install Microsoft Core Fonts (Arial, Times New Roman, Comic Sans, Impact, Trebuchet, Georgia, Verdana)
RUN cd /tmp && \
    wget -q https://www.freedesktop.org/software/fontconfig/webfonts/webfonts.tar.gz && \
    tar -xzf webfonts.tar.gz && \
    cd msfonts && \
    cabextract *.exe && \
    cp *.ttf *.TTF /usr/share/fonts/truetype/msttcorefonts/ 2>/dev/null || true && \
    rm -rf /tmp/webfonts* /tmp/msfonts

# Copy complete Microsoft Office & Windows 10/11 TrueType Fonts (Agency FB, Candara, Calibri, Segoe UI, Aptos, etc.)
COPY fonts/ /usr/share/fonts/truetype/windows/

# Rebuild font cache so LibreOffice discovers all installed fonts instantly
RUN fc-cache -f -v

# Switch back to gotenberg unprivileged user for security
USER gotenberg

# Set default port to 10000 (matches Render & Cloud web service standard)
ENV GOTENBERG_API_PORT=10000
EXPOSE 10000

# Start Gotenberg v8 on port 10000
CMD ["gotenberg", "--api-port=10000", "--libreoffice-restart-after=30"]
