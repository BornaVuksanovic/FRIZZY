pipeline {
    agent any
    
    tools {
            // Pozivamo NodeJS alat definiran u Tools
            nodejs 'NodeJS-20'
        }
        
    stages {
        stage('1. Checkout koda') {
            steps {
                // Povlačenje projekta s Githuba
                git branch: 'main', url: 'https://github.com/BornaVuksanovic/FRIZZY.git'
            }
        }

        stage('2. Instalacija ovisnosti') {
            steps {
                echo 'Instaliram Node.js pakete...'
                sh 'npm install'
            }
        }
        
        stage('3. Priprema Playwright preglednika') {
            steps {
                echo 'Instaliram Chromium preglednik...'
                sh 'npx playwright install chromium'
            }
        }

        stage('4. Pokretanje Playwright testova') {
            steps {
                echo 'Pokrećem Playwright E2E testove...'
                sh 'npx playwright test'
            }
        }

        stage('5. JMeter Stres Testiranje') {
            steps {
                echo 'Pokrećem JMeter performansni test...'
                sh 'jmeter -n -t jmeter/ProjektFrizzy.jmx -l jmeter-results.jtl'
            }
        }

    }
    post {
        always {
            echo 'Spremam QA artefakte (Playwright + JMeter)...'
            archiveArtifacts artifacts: 'playwright-report/**, test-results/**, jmeter-results.jtl', allowEmptyArchive: true
        }
    }
}