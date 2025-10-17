# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## CI/CD Pipeline

This project uses a CI/CD pipeline to automate the build, test, and deployment of the application. The pipeline is defined in the `.github/workflows/ci.yml` file and uses Docker, Mage, Kubernetes, and Terraform to containerize, build, and deploy the application.

### Pipeline Architecture

The pipeline consists of the following components:

- **Docker:** The application is containerized using a multi-stage Dockerfile.
- **Mage:** A `Magefile.go` is used as a portable build script to define targets for building, pushing, and deploying the application.
- **Kubernetes:** The application is deployed to a Google Kubernetes Engine (GKE) cluster.
- **Terraform:** The GKE cluster and a Google Container Registry (GCR) are provisioned using Terraform.
- **GitHub Actions:** The CI/CD pipeline is orchestrated using GitHub Actions.

The pipeline is structured into two main jobs:
1.  **Provision:** This job runs first and uses Terraform to create or update the cloud infrastructure.
2.  **Build and Deploy:** This job runs after the infrastructure is provisioned. It builds a Docker image, pushes it to GCR, and deploys it to the GKE cluster.

### Configuration

To use this pipeline, you need to configure the following secrets in your GitHub repository settings:

- `GCP_PROJECT_ID`: Your Google Cloud project ID.
- `GCP_SA_KEY`: A JSON key for a Google Cloud service account with permissions to manage GKE, GCR, and Terraform resources.

The pipeline uses environment variables defined in the `.github/workflows/ci.yml` file to manage configuration. You can modify these variables to match your environment.

### Local Usage

The following tasks can also be run manually using Mage. You will need to have Go, Docker, `gcloud`, and `kubectl` installed and configured on your local machine.

- `mage build`: Builds the Docker image.
- `mage push`: Pushes the Docker image to GCR. (Requires `IMAGE_NAME` environment variable to be set).
- `mage deploy`: Deploys the application to Kubernetes. (Requires `IMAGE_NAME` environment variable to be set).
- `mage provision`: Provisions the infrastructure using Terraform.
- `mage deprovision`: Deprovisions the infrastructure using Terraform.