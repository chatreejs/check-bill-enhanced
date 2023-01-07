pipeline {
  agent any

  environment {
    DOCKER_TAG = getDockerTag()
    IMAGE_URL = "chatreejs/check-bill-enhanced"
    BASE_HREF = "/billplease/"
  }

  stages {
    stage('Quality Check') {
      steps {
        sh 'echo "Quality Check"'
      }
    }

    stage('Setup Environment') {
      steps {
        script {
          if (env.BRANCH_NAME == 'main') {
            env.IMAGE_URL_WITH_TAG = "${IMAGE_URL}:${DOCKER_TAG}"
          } else {
            def now = new Date()
            BUILD_DATE = now.format("yyyyMMdd", TimeZone.getTimeZone('UTC'))
            env.IMAGE_URL_WITH_TAG = "${IMAGE_URL}:${DOCKER_TAG}-${BUILD_DATE}"
          }
        }
      }
    }

    stage('Build') {
      steps {
        sh 'docker build --build-arg BASE_HREF=${BASE_HREF} -f Dockerfile . -t ${IMAGE_URL_WITH_TAG}'
      }
    }

    stage('Scan Image') {
      steps {
        sh 'trivy image --severity HIGH,CRITICAL --no-progress ${IMAGE_URL_WITH_TAG}'
      }
    }

    stage('Clear dangling image') {
      steps {
        sh 'docker container prune -f && docker image prune -f'
      }
    }

    stage('Push to registry') {
      when {
        anyOf {
          branch 'main'
          branch 'develop'
        }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-credential', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
          sh 'docker login -u $USERNAME -p $PASSWORD'
          sh 'docker push $IMAGE_URL_WITH_TAG'
        }
      }
    }
  }

  post {
    success {
      discordSend description: "Duration: ${currentBuild.durationString}", link: env.BUILD_URL, result: currentBuild.currentResult, title: "${JOB_NAME} - # ${BUILD_NUMBER}", footer: "${currentBuild.getBuildCauses()[0].shortDescription}",webhookURL: 'https://discord.com/api/webhooks/1038846192844541973/zWWNg0uc-FZYGf3ffwo9kc-gtYHRjjCiZIz6U_DNhxcOcShnx5AyyKtKfhH08uUj9f3r'
    }
    failure {
      discordSend description: "Duration: ${currentBuild.durationString}", link: env.BUILD_URL, result: currentBuild.currentResult, title: "${JOB_NAME} - # ${BUILD_NUMBER}", footer: "${currentBuild.getBuildCauses()[0].shortDescription}",webhookURL: 'https://discord.com/api/webhooks/1038846192844541973/zWWNg0uc-FZYGf3ffwo9kc-gtYHRjjCiZIz6U_DNhxcOcShnx5AyyKtKfhH08uUj9f3r'
    }
  }

}

def getDockerTag() {
  def tag = sh script: "git describe --tags `git rev-list --tags --max-count=1`", returnStdout: true
  return tag.trim()
}
