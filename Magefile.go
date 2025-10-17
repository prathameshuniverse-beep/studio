//go:build mage
package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/magefile/mage/mg"
	"github.com/magefile/mage/sh"
)

// envOr returns the value of an environment variable or a default value if the variable is not set.
func envOr(key, defaultValue string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return defaultValue
}

var (
	// Variables
	imageName    = envOr("IMAGE_NAME", "gcr.io/your-gcp-project-id/nextn")
	gcpProjectID = envOr("GCP_PROJECT_ID", "your-gcp-project-id")
	gcpRegion    = envOr("GCP_REGION", "us-central1")
	gcpZone      = envOr("GCP_ZONE", "us-central1-a")
	clusterName  = envOr("CLUSTER_NAME", "nextn-cluster")
)

// Build builds the Docker image.
func Build() error {
	fmt.Println("Building Docker image...")
	return sh.Run("docker", "build", "-t", imageName, ".")
}

// Push pushes the Docker image to a container registry.
func Push() error {
	mg.Deps(Build)
	fmt.Println("Pushing Docker image...")
	return sh.Run("docker", "push", imageName)
}

// Deploy deploys the application to Kubernetes.
func Deploy() error {
	mg.Deps(Push)
	fmt.Println("Updating Kubernetes deployment with new image...")

	// Read the deployment manifest
	deploymentFile := "k8s/deployment.yaml"
	content, err := os.ReadFile(deploymentFile)
	if err != nil {
		return fmt.Errorf("failed to read deployment file: %w", err)
	}

	// Replace the image placeholder
	newContent := strings.Replace(string(content), "your-image-name", imageName, 1)

	// Write the updated content to a temporary file
	tmpFile := "k8s/deployment.tmp.yaml"
	if err := os.WriteFile(tmpFile, []byte(newContent), 0644); err != nil {
		return fmt.Errorf("failed to write temporary deployment file: %w", err)
	}
	defer os.Remove(tmpFile)

	fmt.Println("Deploying to Kubernetes...")
	return sh.Run("kubectl", "apply", "-f", tmpFile)
}

// Provision provisions the infrastructure using Terraform.
func Provision() error {
	fmt.Println("Provisioning infrastructure...")
	return sh.RunV("terraform", "-chdir=terraform", "apply", "-auto-approve",
		"-var", fmt.Sprintf("gcp_project_id=%s", gcpProjectID),
		"-var", fmt.Sprintf("cluster_name=%s", clusterName),
	)
}

// Deprovision deprovisions the infrastructure using Terraform.
func Deprovision() error {
	fmt.Println("Deprovisioning infrastructure...")
	return sh.RunV("terraform", "-chdir=terraform", "destroy", "-auto-approve",
		"-var", fmt.Sprintf("gcp_project_id=%s", gcpProjectID),
		"-var", fmt.Sprintf("cluster_name=%s", clusterName),
	)
}

// Clean cleans up build artifacts.
func Clean() {
	fmt.Println("Cleaning...")
	os.Remove("k8s/deployment.tmp.yaml")
	os.RemoveAll("terraform/.terraform")
	os.RemoveAll("terraform/.terraform.lock.hcl")
}