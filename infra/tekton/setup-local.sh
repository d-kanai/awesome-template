#!/bin/bash
set -e

CLUSTER_NAME="tekton-local"

echo "=== Tekton Local Setup ==="

# Check if kind is installed
if ! command -v kind &> /dev/null; then
    echo "Error: kind is not installed. Install it first:"
    echo "  brew install kind"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed. Install it first:"
    echo "  brew install kubectl"
    exit 1
fi

# Check if cluster already exists
if kind get clusters 2>/dev/null | grep -q "^${CLUSTER_NAME}$"; then
    echo "Cluster '${CLUSTER_NAME}' already exists. Skipping creation."
else
    echo "Creating kind cluster '${CLUSTER_NAME}'..."
    kind create cluster --name "${CLUSTER_NAME}"
fi

# Install Tekton Pipelines
echo "Installing Tekton Pipelines..."
kubectl apply -f https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml

# Install Tekton Dashboard
echo "Installing Tekton Dashboard..."
kubectl apply -f https://storage.googleapis.com/tekton-releases/dashboard/latest/release.yaml

# Wait for Tekton to be ready
echo "Waiting for Tekton Pipelines to be ready..."
kubectl wait --for=condition=ready pod -l app=tekton-pipelines-controller -n tekton-pipelines --timeout=120s

echo "Waiting for Tekton Dashboard to be ready..."
kubectl wait --for=condition=ready pod -l app=tekton-dashboard -n tekton-pipelines --timeout=120s

echo ""
echo "=== Setup Complete ==="
echo "Run 'make tekton-hello' to test with a Hello World task"
echo "Run 'make tekton-dashboard' to open the Tekton Dashboard"
