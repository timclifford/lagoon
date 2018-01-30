#!/bin/bash
set -x
set -eo pipefail

OPENSHIFT_REGISTRY=docker-registry.default.svc:5000
OPENSHIFT_PROJECT=$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace)

if [ "$CI_USE_OPENSHIFT_REGISTRY" == "true" ]; then
  CI_OVERRIDE_IMAGE_REPO=${OPENSHIFT_REGISTRY}/lagoon
else
  CI_OVERRIDE_IMAGE_REPO=""
fi

if [ "$TYPE" == "pullrequest" ]; then
  /scripts/git-checkout-pull-merge.sh "$SOURCE_REPOSITORY" "$PR_HEAD_SHA" "$PR_BASE_SHA"
else
  /scripts/git-checkout-pull.sh "$SOURCE_REPOSITORY" "$GIT_REF"
fi

LAGOON_GIT_SHA=`git rev-parse HEAD`

if [ ! -f .lagoon.yml ]; then
  echo "no .lagoon.yml file found"; exit 1;
fi

DOCKER_REGISTRY_TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)

docker login -u=jenkins -p="${DOCKER_REGISTRY_TOKEN}" ${OPENSHIFT_REGISTRY}

DEPLOYER_TOKEN=$(cat /var/run/secrets/lagoon/deployer/token)

oc login --insecure-skip-tls-verify --token="${DEPLOYER_TOKEN}" https://kubernetes.default.svc

ADDITIONAL_YAMLS=($(cat .lagoon.yml | shyaml keys additional-yaml || echo ""))

for ADDITIONAL_YAML in "${ADDITIONAL_YAMLS[@]}"
do
  ADDITIONAL_YAML_PATH=$(cat .lagoon.yml | shyaml get-value additional-yaml.$ADDITIONAL_YAML.path false)
  if [ $ADDITIONAL_YAML_PATH == "false" ]; then
    echo "No 'path' defined for additional yaml $ADDITIONAL_YAML"; exit 1;
  fi

  if [ ! -f $ADDITIONAL_YAML_PATH ]; then
    echo "$ADDITIONAL_YAML_PATH for additional yaml $ADDITIONAL_YAML not found"; exit 1;
  fi

  ADDITIONAL_YAML_COMMAND=$(cat .lagoon.yml | shyaml get-value additional-yaml.$ADDITIONAL_YAML.command apply)
  ADDITIONAL_YAML_IGNORE_ERROR=$(cat .lagoon.yml | shyaml get-value additional-yaml.$ADDITIONAL_YAML.ignore_error false)
  ADDITIONAL_YAML_IGNORE_ERROR="${ADDITIONAL_YAML_IGNORE_ERROR,,}" # convert to lowercase, as shyaml returns "True" if the yaml is set to "true"
  . /scripts/exec-additional-yaml.sh
done

. /build-deploy-docker-compose.sh
