// @flow

const { knex } = require('../../util/db');

/* ::

import type {SqlObj} from '../';

*/

const Sql /* : SqlObj */ = {
  selectAllProblems: () =>
    knex('environment_problem')
    .select({id: 'id', data: 'data'}).toString()
};

module.exports = Sql;
