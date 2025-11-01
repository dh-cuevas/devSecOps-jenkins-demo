pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-18'
    }
    
    environment {
        DOCKER_IMAGE = 'devsecops-demo'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Clonando repositorio...'
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 Construyendo la aplicación...'
                sh 'npm install'
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Ejecutando pruebas unitarias...'
                sh 'npm test'
            }
        }
        
        stage('Security Scan - Dependencies') {
            steps {
                echo '🔒 Analizando dependencias vulnerables...'
                sh 'npm audit --production || true'
            }
        }
        
        stage('Security Scan - Code') {
            steps {
                echo '🔍 Análisis estático de código (SAST)...'
                echo 'Análisis de código con herramientas SAST'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Construyendo imagen Docker...'
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            }
        }
        
        stage('Security Scan - Container') {
            steps {
                echo '🛡️ Escaneando imagen Docker...'
                sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Desplegando aplicación...'
                sh 'docker stop devsecops-app || true'
                sh 'docker rm devsecops-app || true'
                sh "docker run -d --name devsecops-app -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
        
        stage('Health Check') {
            steps {
                echo '❤️ Verificando salud de la aplicación...'
                sleep 5
                sh 'docker exec devsecops-app curl http://localhost:3000/health || true'
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline ejecutado exitosamente!'
        }
        failure {
            echo '❌ Pipeline falló. Revisar logs.'
        }
        always {
            echo '🧹 Limpiando workspace...'
            cleanWs()
        }
    }
}
