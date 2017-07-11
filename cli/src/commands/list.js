// @flow

import { table } from 'table';
import { red } from 'chalk';
import { prepend, pathOr, propOr, map, compose, sortBy, toLower } from 'ramda';

import gql from '../gql';
import { runGQLQuery } from '../query';
import { printNoConfigError, printErrors, printGraphQLErrors } from '../printErrors';

import typeof Yargs from 'yargs';
import type { BaseArgs } from './index';

const name = 'list';
const description = 'Lists specific deployment information';

export async function setup(yargs: Yargs): Promise<Object> {
  return yargs
    .usage(`$0 ${name} [target] - ${description}`)
    .options({
      sitegroup: {
        demandOption: false,
        describe: 'Overrides the currently configured sitegroup (.amazeeio.yml)',
        type: 'string',
      },
    })
    .alias('s', 'sitegroup')
    .example(
      `$0 ${name} sites`,
      'Lists all sites for the specific sitegroup configured in your .amazeeio.yml config file',
    )
    .example(
      `$0 ${name} sites -s mysitegroup`,
      'Lists all sites for a specific sitegroup (instead of using the config file)',
    ).argv;
}

type MainArgs = {
  sitegroup: string,
  clog?: typeof console.log,
};

export async function listSites(args: MainArgs): Promise<number> {
  // eslint-disable-next-line no-console
  const { sitegroup, clog = console.log } = args;

  const query = gql`
    query querySites($sitegroup: String!) {
      siteGroupByName(name: $sitegroup) {
        gitUrl
        sites {
          siteName
          siteBranch
          siteEnvironment
        }
      }
    }
  `;

  const result = await runGQLQuery({
    query,
    variables: { sitegroup },
  });

  const { errors } = result;
  if (errors != null) {
    return printGraphQLErrors(clog, ...errors);
  }

  const sortBySite = sortBy(compose(toLower, propOr('', 'siteName')));

  const nodes = compose(sortBySite, pathOr([], ['data', 'siteGroupByName', 'sites']))(result);

  if (nodes.length === 0) {
    clog(red(`No sites found for sitegroup '${sitegroup}'`));
    return 0;
  }

  clog(`I found following sites for sitegroup '${sitegroup}':`);

  const tableConfig = {
    columns: {
      // $FlowIssue: Flow doesn't understand numbers as keys https://github.com/facebook/flow/issues/380
      0: {
        // eslint-disable-line quote-props
        alignment: 'left',
        minWidth: 15,
      },
      // $FlowIssue: Flow doesn't understand numbers as keys https://github.com/facebook/flow/issues/380
      1: {
        // eslint-disable-line quote-props
        alignment: 'left',
        minWidth: 15,
      },
      // $FlowIssue: Flow doesn't understand numbers as keys https://github.com/facebook/flow/issues/380
      2: {
        // eslint-disable-line quote-props
        alignment: 'center',
        minWidth: 15,
      },
    },
  };

  const tableBody = map((node) => {
    const inProdMarker = node.siteEnvironment === 'production' ? '\u221A' : '';
    return [node.siteName, node.siteBranch, inProdMarker];
  }, nodes);

  const tableData = prepend(['Site', 'Branch', 'Deployed?'], tableBody);

  clog(table(tableData, tableConfig));

  return 0;
}

type Target = 'sites';

type Args = BaseArgs & {
  sitegroup: ?string,
  target: Target,
};

export async function run(args: Args): Promise<number> {
  // eslint-disable-next-line no-console
  const { config, clog = console.log } = args;

  // FIXME: doesn't handle empty config file case correctly
  if (config == null) {
    return printNoConfigError(clog);
  }

  const [target] = args._.slice(1);
  const sitegroup = args.sitegroup || config.sitegroup;

  switch (target) {
    case 'sites':
      return listSites({ sitegroup });
    default:
      return printErrors(clog, `Unknown target ${target} ... possible values: 'sites'`);
  }
}

export default {
  setup,
  name,
  description,
  run,
};
