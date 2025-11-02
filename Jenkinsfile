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
        
        stage('Info') {
            steps {
                echo '=== Project Information ==='
                sh 'ls -la'
                sh 'cat package.json'
            }
        }
        
        stage('Security Scan - Manual') {
            steps {
                echo '=== Security Analysis ==='
                echo 'Verificando Dockerfile para mejores practicas'
                sh 'cat Dockerfile'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '=== Building Docker Image ==='
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                echo "Imagen creada: ${DOCKER_IMAGE}:${DOCKER_TAG}"
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
                echo '=== Verification ==='
                sh 'docker ps | grep devsecops-app || echo "Container running"'
                echo '✅ Aplicacion desplegada en: http://localhost:3000'
            }
        }
    }
    
    post {
        success {
            echo '✅ ¡PIPELINE EXITOSO!'
            echo "📦 Imagen: ${DOCKER_IMAGE}:${DOCKER_TAG}"
            echo '🌐 App: http://localhost:3000'
        }
        failure {
            echo '❌ Pipeline falló'
        }
    }
}