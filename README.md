# UHNW Liquidity Intelligence Platform

A comprehensive platform for Ultra High Net Worth (UHNW) client management in the **Middle East and Gulf region**, featuring a dedicated **Data Platform** for real-time liquidity event detection.

## 🌍 Regional Focus

This platform is designed for wealth management in the Middle East, with support for:
- **Primary Markets**: Dubai (DFM), Abu Dhabi (ADX), Riyadh (Tadawul)
- **Currency**: USD/AED with regional exchange rates
- **Data Sources**: DFSA, Bloomberg Gulf, Gulf News, Arabian Business
- **Geographic Coverage**: UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman

## 🚀 Key Features

* **Executive Dashboard**: High-level metrics and AI insights.
* **RM Workstation**: Tools for Relationship Managers to track leads and opportunities.
* **Data Platform**: Real-time processing of financial signals using Kafka and Spark.

## 🏗 Data Platform Architecture

The data platform is built on modern event-driven principles:

* **Ingestion**: Real-time streaming via **Apache Kafka** (AWS MSK).
* **Processing**: Batch and Streaming processing using **Apache Spark**.
* **Storage**: Data Lakehouse architecture on **AWS S3**.
* **Infrastructure**: Managed via **Terraform**.

## 🛠 Getting Started

### Prerequisites

* Node.js 18+
* Python 3.11+
* Docker & Docker Compose
* Terraform 1.5+
* AWS CLI

### Quick Start

1. **Web App**:

    ```bash
    npm install
    npm run dev
    ```

2. **Data Platform (Local)**:

    ```bash
    ./scripts/setup.sh
    docker-compose up -d
    ```

## 📂 Project Structure

* `app/`: Next.js Web Application
* `src/`: Data Platform source code (Pipelines, Notebooks)
* `infra/`: Terraform Infrastructure-as-Code
* `data/`: Schemas and migrations
* `docs/`: Comprehensive documentation

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.
