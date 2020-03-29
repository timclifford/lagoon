// @flow

const R = require('ramda');
const { sendToLagoonLogs } = require('@lagoon/commons/src/logs');
const { createMiscTask } = require('@lagoon/commons/src/tasks');
const { query, isPatchEmpty } = require('../../util/db');
const environmentHelpers = require('../environment/helpers');
const Sql = require('./sql');

/* ::

import type {ResolversObj} from '../';

*/

/* //current Table structure - this will change as deving
CREATE TABLE IF NOT EXISTS environment_problem (
  id                       int NOT NULL auto_increment PRIMARY KEY,
  environment              int REFERENCES environment (id),
  severity                 varchar(300) DEFAULT '',
  identifier               varchar(300) DEFAULT '',
  lagoon_service           varchar(300) DEFAULT '',
  source                   varchar(300) DEFAULT '',
  data                     JSON,
  created                  timestamp,
  deleted                  timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  UNIQUE(environment, identifier, deleted)
);
*/

const getAllProblems = async (parent, args, { sqlClient, hasPermission },) => {
  //Let's try grab all the problems using sql ...
  return await query(sqlClient, Sql.selectAllProblems());
}


const getProblemsByEnvironmentId = async (
  {id: environmentId},
  {},
  { sqlClient, hasPermission },
) => {
  const environment = await environmentHelpers(sqlClient).getEnvironmentById(environmentId);
  //TODO: permissions setup
  // await hasPermission('problem', 'view', {
  //   project: environment.project,
  // });

  const rows = await query(
    sqlClient,
    Sql.selectProblemsByEnvironmentId(environmentId),
  );

  return  R.sort(R.descend(R.prop('created')), rows);
};


const addProblem = async (
  root,
  {
    input: {
      id, environment: environmentId, identifier, service, source, data, created,
    },
  },
  { sqlClient, hasPermission },
) => {
  const environment = await environmentHelpers(sqlClient).getEnvironmentById(environmentId);
  await hasPermission('problem', 'add', {
    project: environment.project,
  });

  const {
    info: { insertId },
  } = await query(
    sqlClient,
    Sql.insertProblem({
      id,
      lagoon_service: service,
      identifier,
      environment: environmentId,
      source,
      data,
      created,
    }),
  );
  const rows = await query(sqlClient, Sql.selectProblemByDatabaseId(insertId));
  const problem = R.prop(0, rows);

  return problem;
};

const deleteProblem = async (
  root,
  {
    input : {
      environment: environmentId,
      identifier,
    }
  },
  { sqlClient, hasPermission },
  ) => {
  const environment = await environmentHelpers(sqlClient).getEnvironmentById(environmentId);
  //TODO: permissions setup
  // await hasPermission('problem', 'add', {
  //   project: environment.project,
  // });
  await query(sqlClient, Sql.deleteProblem(environmentId, identifier));
  return 'success';
}

const Resolvers /* : ResolversObj */ = {
  getProblemsByEnvironmentId,
  getAllProblems,
  addProblem,
  deleteProblem,
};

module.exports = Resolvers;
