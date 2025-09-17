pipeline {
  agent any

  environment {
    REGISTRY = "image-registry.openshift-image-registry.svc:5000/inventaris"
    IMAGE_TAG = "${env.BUILD_NUMBER ?: 'latest'}"
    NAMESPACE = "inventory-ba"
    OCP_API = "https://api.cluster-qjwdn.dynamic.redhatworkshops.io:6443"
    OCP_TOKEN = "sha256~yfLGl7zMjScA5z_-cf2WdAfHsbMMGl2sSHOHuvw4S5I"
    APP_NAME = "inventaris"
    HELM_VERSION = "v3.14.0"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Generate package.json') {
      steps {
        script {
          def services = ['gateway','user-service','inventory-service','transaction-service','frontend']
          for (s in services) {
            sh """
              mkdir -p ${s}
              if [ ! -f ${s}/package.json ]; then
                if [ "${s}" = "frontend" ]; then
                  cat > ${s}/package.json <<EOF
{
  "name": "${s}",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  },
  {
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
EOF
                else
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
                fi
                echo "Generated package.json for ${s}"
              else
                echo "package.json exists for ${s}, skipping"
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
          sh "oc login ${OCP_API} --token=${OCP_TOKEN} --insecure-skip-tls-verify=true"
          for (s in services) {
            sh """
              if ! oc get bc ${s} -n ${NAMESPACE} >/dev/null 2>&1; then
                oc new-build --binary --name=${s} -n ${NAMESPACE} --strategy=docker
              fi
              oc start-build ${s} --from-dir=${s} --follow -n ${NAMESPACE}
            """
          }
        }
      }
    }

    stage('Tag Images') {
      steps {
        script {
          def services = ['gateway','user-service','inventory-service','transaction-service','frontend']
          for (s in services) {
            sh "oc tag ${NAMESPACE}/${s}:latest ${NAMESPACE}/${s}:${IMAGE_TAG} || echo 'Skip tagging, image not ready'"
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
          chmod +x \$WORKSPACE/bin/helm
          export PATH=\$WORKSPACE/bin:\$PATH
          \$WORKSPACE/bin/helm version
        """
      }
    }

    stage('Deploy with Helm') {
      steps {
        sh """
          oc project ${NAMESPACE}
          \$WORKSPACE/bin/helm upgrade --install ${APP_NAME} helm/ --namespace ${NAMESPACE} --set image.tag=${IMAGE_TAG} --atomic --wait --timeout 5m --force --replace
        """
      }
    }

    stage('Restart Deployments') {
      steps {
        script {
          def services = ['gateway','user-service','inventory-service','transaction-service','frontend']
          for (s in services) {
            sh "oc rollout restart deployment ${s} -n ${NAMESPACE} || echo 'Deployment ${s} not found, skip...'"
          }
        }
      }
    }
  }
}
