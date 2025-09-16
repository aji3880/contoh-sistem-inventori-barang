pipeline {
  agent any

  environment {
    REGISTRY = "image-registry.openshift-image-registry.svc:5000/inventaris"
    IMAGE_TAG = "${env.BUILD_NUMBER ?: 'latest'}"
    NAMESPACE = "inventory-ba"
    OCP_API = "https://api.cluster-qjwdn.dynamic.redhatworkshops.io:6443"
    OCP_TOKEN = "sha256~9JKgf2E1-ighI5C6C5d7c0yj93gezvloZShNbLm23Fg"
    APP_NAME = "inventaris"
    HELM_VERSION = "v3.14.0"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare package.json') {
      steps {
        script {
          def services = ['gateway', 'user-service', 'inventory-service', 'transaction-service', 'frontend']
          for (s in services) {
            sh """
              mkdir -p ${s}
              if [ ! -f ${s}/package.json ]; then
                cat > ${s}/package.json <<EOF
{
  "name": "${s}",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF
                echo "Generated package.json for ${s}"
              else
                echo "package.json already exists for ${s}, skipping..."
              fi
            """
          }
        }
      }
    }

   stage('Build & Push Images') {
        steps {
            script {
            def services = ['gateway','user-service','inventory-service','transaction-service','frontend']
                for(s in services){
                    sh "oc login ${OCP_API} --token=${OCP_TOKEN} --insecure-skip-tls-verify=true"
                    
                    sh """
                    if ! oc get bc ${s} -n ${NAMESPACE} >/dev/null 2>&1; then
                    oc new-build --binary --name=${s} -n ${NAMESPACE} --strategy=docker
                    fi
                    """
                    
                    sh "oc start-build ${s} --from-dir=${s} --follow -n ${NAMESPACE}"
                }
            }
        }
    }

    stage('Tag Images') {
      steps {
        script {
          def services = ['gateway','user-service','inventory-service','transaction-service','frontend']
          for(s in services){
            sh "oc tag ${NAMESPACE}/${s}:latest ${NAMESPACE}/${s}:${IMAGE_TAG} || echo 'Skip tagging, source not found'"
          }
        }
      }
    }

    stage('Install Helm') {
        steps {
            sh """
            curl -sSL https://get.helm.sh/helm-${HELM_VERSION}-linux-amd64.tar.gz -o helm.tar.gz
            tar -xzf helm.tar.gz
            mkdir -p \$WORKSPACE/bin
            mv linux-amd64/helm \$WORKSPACE/bin/helm
            export PATH=\$WORKSPACE/bin:\$PATH
            \$WORKSPACE/bin/helm version
            """
        }
    }

    stage('Deploy with Helm') {
        steps {
            script {
            sh "oc project ${NAMESPACE}"
            sh "\$WORKSPACE/bin/helm upgrade --install ${APP_NAME} helm/ --namespace ${NAMESPACE} --set image.tag=${IMAGE_TAG}"
            sh "\$WORKSPACE/bin/helm upgrade --install ${APP_NAME} helm/ --namespace ${NAMESPACE} --set image.tag=${IMAGE_TAG} --dry-run --debug"
            }
        }
    }

    stage('Deploy to OpenShift') {
        steps {
            script {
                sh """
                oc rollout restart deployment ${APP_NAME} -n ${NAMESPACE}
                """
            }
        }
    }
  }
}