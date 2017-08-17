FROM rabbitmq:3-management

COPY services/rabbitmq/rabbitmq_delayed_message_exchange-0.0.1.ez /plugins
COPY services/rabbitmq/autocluster-0.6.1.ez /plugins
COPY services/rabbitmq/rabbitmq_aws-0.1.2.ez /plugins
RUN rabbitmq-plugins enable --offline rabbitmq_delayed_message_exchange

ENV RABBITMQ_DEFAULT_USER=guest \
    RABBITMQ_DEFAULT_PASS="guest" \
    AUTOCLUSTER_LOG_LEVEL="debug" \
    AUTOCLUSTER_TYPE="etcd" \
    NODENAME="rabbitmq@localhost"
