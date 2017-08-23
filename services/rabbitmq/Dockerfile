FROM rabbitmq:3-management

COPY services/rabbitmq/rabbitmq_delayed_message_exchange-0.0.1.ez /plugins

RUN rabbitmq-plugins enable --offline rabbitmq_delayed_message_exchange

ENV RABBITMQ_DEFAULT_USER=guest \
    RABBITMQ_DEFAULT_PASS="guest"


COPY services/rabbitmq/rabbit-wrapper.sh /
RUN chmod 755 /rabbit-wrapper.sh


EXPOSE 4369 5671 5672 25672
CMD ["/rabbit-wrapper.sh"]
