---
icon: material/home 
---

# Home

## Welcome to the Sidra BioInformatics Data Platform Documentation

This platform is a custom solution developed to assist in tracking various genome samples. It meticulously records essential details, such as the date a sample was requested for sequencing, the stages of the entire pipeline until completion, and enables visualization of related metadata, including reference genomes and sample status.

### Target Audience
This documentation is intended for **end-users** of the platform, who may also be potential future developers.

### Core Functionalities
- **Data Extraction**: The platform extracts data from specified files, directories, and filepaths, saving this information to a PostgreSQL database. This extraction process is read-only, ensuring the integrity of the original data sources.
- **Web Interface**: A user-friendly web interface, built with ReactJS, allows users to interact with the data stored in the database without modifying the original directories.
- **Virtual Machine Deployment**: The entire project is designed to run on a Virtual Machine (VM), which has access to the necessary directories.

### Software Stack
- **Database**: PostgreSQL (Version 12)
- **API Server**: Flask (Version 2.3.2)
- **Web Interface**: ReactJS (Version 18.2.0)

### Project Deployment Requirements

#### System Requirements
- Virtual Machine (VM) with:
  - Operating System: Linux (Ubuntu 22.04.2 LTS)
  - CPU: 4 cores
  - RAM: 8 GB
  - Storage: ~300 GB

#### Software Requirements
- Node.js: Version 18.17.0
- Python: Version 3.11.4
- PostgreSQL: Latest version
- Flask: Version 2.3.2
- Additional Flask Libraries: `flask_cors`, `psycopg2`
- Git: Latest stable version
- Visual Studio Code: Latest version

#### Network Requirements
- Static IP Address
- Necessary Ports: HTTP/HTTPS (default 3000), Flask server (default 5000), PostgreSQL (default 5432)

#### Backup and Recovery
- Daily backups of the PostgreSQL database

#### Maintenance and Monitoring
- Regular system monitoring for optimal performance
- Routine log reviews for potential issues

#### Scalability
- Designed to handle up to 150,000 samples over the next 10 years.

### Contact Information
For further assistance or inquiries, please contact us at:
- Email: [thedeepchandra@gmail.com](mailto:support@sidrabioinformatics.com)
- Phone: +974 66449748