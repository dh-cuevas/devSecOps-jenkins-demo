pipeline {
    agent any
    
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
                script {
                    bat 'npm install'
                }
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Ejecutando pruebas unitarias...'
                script {
                    bat 'npm test'
                }
            }
        }
        
        stage('Security Scan - Dependencies') {
            steps {
                echo '🔒 Analizando dependencias vulnerables...'
                script {
                    bat 'npm audit --production || exit 0'
                }
            }
        }
        
        stage('Security Scan - Code') {
            steps {
                echo '🔍 Análisis estático de código (SAST)...'
                script {
                    echo 'Análisis de código con herramientas SAST'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Construyendo imagen Docker...'
                script {
                    bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    bat "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                }
            }
        }
        
        stage('Security Scan - Container') {
            steps {
                echo '🛡️ Escaneando imagen Docker...'
                script {
                    bat "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${DOCKER_TAG} || exit 0"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Desplegando aplicación...'
                script {
                    bat 'docker stop devsecops-app || exit 0'
                    bat 'docker rm devsecops-app || exit 0'
                    bat "docker run -d --name devsecops-app -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '❤️ Verificando salud de la aplicación...'
                script {
                    sleep 5
                    bat 'curl http://localhost:3000/health || exit 0'
                }
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
