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
                sh 'npm --version'
                sh 'npm install'
                sh 'npm test'
            }
        }
        
        stage('Security Audit') {
            agent {
                docker { 
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo '=== Security Scan - Dependencies ==='
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
        
        stage('Deploy') {
            steps {
                echo '=== Deploying Application ==='
                sh 'docker stop devsecops-app 2>/dev/null || true'
                sh 'docker rm devsecops-app 2>/dev/null || true'
                sh "docker run -d --name devsecops-app -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sleep 5
            }
        }
        
        stage('Verify') {
            steps {
                echo '=== Verifying Deployment ==='
                sh 'docker ps | grep devsecops-app'
                echo 'Aplicacion en: http://localhost:3000'
            }
        }
    }
    
    post {
        success {
            echo '=== Pipeline SUCCESS ==='
        }
        failure {
            echo '=== Pipeline FAILED ==='
        }
    }
}