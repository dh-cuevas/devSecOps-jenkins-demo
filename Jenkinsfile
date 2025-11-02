pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'devsecops-demo'
        DOCKER_TAG = "build-${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '=== Checkout Code ==='
                checkout scm
            }
        }
        
        stage('Build & Test') {
            agent {
                docker { 
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo '=== Building Application ==='
                sh 'npm install'
                sh 'npm test'
            }
        }
        
        stage('Security Scan - Dependencies') {
            agent {
                docker { 
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo '=== Security: npm audit ==='
                sh 'npm install'
                sh 'npm audit --production || true'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '=== Building Docker Image ==='
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            }
        }
        
        stage('Security Scan - Container') {
            steps {
                echo '=== Security: Trivy scan ==='
                sh """
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest image \
                    --severity HIGH,CRITICAL \
                    ${DOCKER_IMAGE}:${DOCKER_TAG} || true
                """
            }
        }
        
        stage('Deploy') {
            steps {
                echo '=== Deploying Application ==='
                sh 'docker stop devsecops-app || true'
                sh 'docker rm devsecops-app || true'
                sh "docker run -d --name devsecops-app -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
        
        stage('Health Check') {
            steps {
                echo '=== Health Check ==='
                sleep 10
                sh 'docker exec devsecops-app wget -q -O- http://localhost:3000/health || true'
                echo '✅ App corriendo en: http://localhost:3000'
            }
        }
    }
    
    post {
        success {
            echo '================================'
            echo '✅ PIPELINE SUCCESS!'
            echo '================================'
            echo "Imagen: ${DOCKER_IMAGE}:${DOCKER_TAG}"
            echo 'App: http://localhost:3000'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}