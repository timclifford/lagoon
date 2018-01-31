const logger = require('./logger');
const createServer = require('./server');
const MariaSQL = require('mariasql');

(async () => {
  logger.debug('Starting to boot the application.');

  try {
    const { JWTSECRET, JWTAUDIENCE } = process.env;

    const sqlClient = new MariaSQL({
      host: 'api-db',
      port: 3306,
      user: 'api',
      password: 'api',
      db: 'infrastructure'
    });

    sqlClient.on('error', (error) => {
      logger.error(error);
    })

    await createServer({
      jwtSecret: JWTSECRET,
      jwtAudience: JWTAUDIENCE,
      sqlClient,
    });

    logger.debug('Finished booting the application.');
  } catch (e) {
    logger.error('Error occurred while starting the application');
    logger.error(e.stack);
  }
})();



