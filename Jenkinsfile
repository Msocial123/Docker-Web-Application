pipeline {
  agent any
  parameters{
        string(name: 'VERSION', description: 'Enter the APP VERSION')
    }
environment{
        AWS_ACCOUNT_ID="124355653176"
        REGION="ap-southeast-1"
        REPO_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/project"
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REGISTRY_CREDENTIALS = 'docker-cred'
    }
  stages {
    stage('Clone') {
        steps{
        script{
                    echo "Clone started"
                    gitInfo = checkout scm
                            
        }
      }
    }

    stage('Docker build'){
            steps{
                script{                  
                        sh """
                         docker build -t web-app:${VERSION} .
                        """
                }
            }
        }

    stage('Image push to ECR'){
            steps{
                script{
                    withAWS(credentials: 'aws-cred', region: "${REGION}") {
                        sh """
                            aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com
                        docker tag web-app:${VERSION} ${REPO_URI}:${VERSION}
                        docker push ${REPO_URI}:${VERSION}
                        """
                    }
                }
            }
        }
        
    #stage('Image push to Docker Hub'){
            steps{
                script{
                        withCredentials([usernamePassword(credentialsId: "${DOCKER_REGISTRY_CREDENTIALS}", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    
                        sh """
                        docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
                        docker tag web-app:${VERSION}  muralisocial123/web-app:${VERSION}
                        docker push muralisocial123/web-app:${VERSION}
                        """
                    
                }
                }
            }
        }
    stage('Deployment'){
            steps{
                script{
                    withAWS(credentials: 'aws-cred', region: "${REGION}") {
                        sh """
                        aws eks update-kubeconfig --region ${REGION} --name test-cluster
                        kubectl apply -f autoscaling.yaml
                        """
                    }
                }
            }
        }
  

}
}