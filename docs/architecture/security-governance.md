# Security & Governance Architecture

## 1. Authentication & Authorization

* **Identity Provider**: Integration with Enterprise Active Directory via SAML 2.0 / OIDC.
* **Role-Based Access Control (RBAC)**:
  * **Data Engineer**: Full access to Bronze/Silver S3, Glue, EMR.
  * **Data Analyst**: Read-only access to S3 Gold (via Athena), No PII access.
  * **Service Accounts**: Minimal IAM policies for Lambda/Glue jobs.
* **API Security**: All internal APIs protected via AWS API Gateway + Cognito.

## 2. Data Encryption

* **At Rest**:
  * **S3**: Server-Side Encryption with KMS Managed Keys (SSE-KMS).
  * **RDS/MSK**: Storage encrypted using AWS KMS.
* **In Transit**:
  * TLS 1.2+ mandatory for all internal and external traffic.
  * mTLS (Mutual TLS) for Kafka producer authentication.

## 3. Network Security

* **VPC Isolation**:
  * **Public Subnets**: Only Load Balancers and NAT Gateways.
  * **Private Subnets**: Compute (EMR, EC2), Databases (RDS), and Storage Endpoints.
* **Security Groups**: Whitelist-only access (e.g., RDS accepts traffic ONLY from ECS Tasks SG).
* **VPC Endpoints**: S3 and DynamoDB accessed via Gateway Endpoints (traffic never leaves AWS network).

## 4. Data Governance & Lineage

* **Data Catalog**: AWS Glue Data Catalog serves as the central metastore.
* **Schema Registry**: AWS Glue Schema Registry enforces Avro schemas for Kafka topics to prevent "schema drift".
* **Lineage Tracking**:
  * **OpenLineage** integration in Spark jobs to track dataset inputs/outputs.
  * Tags: `Project: UHNW`, `Classification: PII`, `Owner: DataTeam`.

## 5. Compliance Controls (DPDP)

* **Data Residency**: All buckets and instances pinned to the selected compliant region (e.g., `me-south-1` for Middle East deployments) to meet local data protection requirements.
* **PII Handling**:
  * **Masking**: Phone numbers and emails hashed (SHA-256) during Silver ingestion.
  * **Right to Erasure**: Spark job designed to locate and "tombstone" records for deleted users in Data Lake.
