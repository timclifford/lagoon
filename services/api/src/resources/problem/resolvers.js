// @flow

const R = require('ramda');
const { sendToLagoonLogs } = require('@lagoon/commons/src/logs');
const { createMiscTask } = require('@lagoon/commons/src/tasks');
const { query, isPatchEmpty } = require('../../util/db');
const Sql = require('./sql');

/* ::

import type {ResolversObj} from '../';

*/


/* //current Table structure - this will change as deving
NOTE: this corresponds to the table
CREATE TABLE IF NOT EXISTS environment_problem (
  id                       int NOT NULL auto_increment PRIMARY KEY,
  environment              int REFERENCES environment (id),
  lagoon_service           varchar(300),
  source                   varchar(300),
  data                     JSON,
  created                  timestamp,
  deleted                  timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
);
*/

const getAllProblems = async (parent, args, { sqlClient, hasPermission },) => {
  //Let's try grab all the problems using sql ...
  return await query(sqlClient, Sql.selectAllProblems());
}

const getProblemsByEnvironmentId = async (
  { id: environmentId },
  { sqlClient, hasPermission },
) => {
  console.log(environmentId)
  const problems = [
    {
      id: 1,
      data: "This is the first problem"
    },
    {
      id: 2,
      data: "This is the second problem"
    }
  ];

  // const environment = await environmentHelpers(sqlClient).getEnvironmentById(environmentId);
  // await hasPermission('backup', 'view', {
  //   project: environment.project,
  // });

  // const rows = await query(
  //   sqlClient,
  //   Sql.selectBackupsByEnvironmentId({ environmentId, includeDeleted }),
  // );

  // const newestFirst = R.sort(R.descend(R.prop('created')), rows);

  // return newestFirst;
  return problems;
};


const Resolvers /* : ResolversObj */ = {
  getProblemsByEnvironmentId,
  getAllProblems,
};

module.exports = Resolvers;
