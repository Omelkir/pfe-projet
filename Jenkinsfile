pipeline {
    agent { label 'agentjenkins' }
    parameters {
        booleanParam(
            name: 'RUN_SONAR_SCAN', 
            defaultValue: false, 
            description: 'Exécuter l’analyse SonarQube ?'
        )
    }
    
    environment {
        SONAR_SCANNER_HOME = tool 'SonarQubeScanner' // Outil défini dans Jenkins
        SONAR_HOST_URL = 'http://jenkins.frequencem.com:9000/' // URL du serveur SonarQube
        SONAR_TOKEN = 'sqa_3810b08a587e0497010293bbafa7729395aa7f3a'
    }
    options {
        skipDefaultCheckout(true)
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
                sh 'git branch' // Debug: Check the current branch
                sh 'git log -1' // Debug: Check the latest commit
            }
        }

        // Le stage SonarQube Analysis s'exécute uniquement si le paramètre RUN_SONAR_SCAN est à true.
        stage('SonarQube Analysis') {
            when {
                expression { params.RUN_SONAR_SCAN }
            }
            steps {
                script {
                    withSonarQubeEnv('SonarQube') { // Assure-toi que ce nom est bien défini dans Jenkins
                        sh 'docker run --rm -e SONAR_TOKEN="${SONAR_TOKEN}" -v "$(pwd):/usr/src" sonarsource/sonar-scanner-cli'
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo '🔨 Copying environment files...'
                    sh 'cp /home/.config/MediConnect/.env .'
                    echo '🐳 Building image...'
                    sh 'docker compose down'
                    sh 'docker compose build --no-cache' // Force a fresh build
                    sh 'docker compose up -d'
                }
            }
        }
    } // Closing brace for the `stages` block

    post {
        success {
            echo '✅ Pipeline succeeded! Backend and frontend are running.'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs for errors.'
        }
    }
}
