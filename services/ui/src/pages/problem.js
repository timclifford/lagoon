import React from 'react';
import * as R from 'ramda';
import { withRouter } from 'next/router';
import Head from 'next/head';
import { Query } from 'react-apollo';
import MainLayout from 'layouts/MainLayout';
import getProblemByIdentifier from 'lib/query/ProblemByIdentifier';
import Breadcrumbs from 'components/Breadcrumbs';
import ProjectBreadcrumb from 'components/Breadcrumbs/Project';
import ProblemBreadcrumb from 'components/Breadcrumbs/Problem';
import NavTabs from 'components/NavTabs';
import Problem from "components/Problem";
import withQueryLoading from 'lib/withQueryLoading';
import withQueryError from 'lib/withQueryError';
import {
  withEnvironmentRequired,
  withProblemRequired
} from 'lib/withDataRequired';
import { bp } from 'lib/variables';

/**
 * Displays a problem page, given the openshift project and problem ID.
 */
export const PageProblem = ({ router }) => {
    return (
    <>
        <Head>
            <title>{`${router.query.identifier} | Problem`}</title>
        </Head>
        <Query
            query={getProblemByIdentifier}
            variables={{
                openshiftProjectName: router.query.openshiftProjectName,
                identifier: router.query.identifier.toLowerCase()
            }}
        >
            {R.compose(
                withQueryLoading,
                withQueryError,
                withEnvironmentRequired,
                withProblemRequired
            )(({ data: { environment } }) => {

                const problem = {
                    ...environment.problem,
                    environment: {
                        id: environment.id,
                        openshiftProjectName: environment.openshiftProjectName,
                        project: environment.project
                    }
                };

                return (
                    <MainLayout>
                        <Breadcrumbs>
                            <ProjectBreadcrumb projectSlug={environment.project.name} />
                            <ProblemBreadcrumb
                                header={`${environment.openshiftProjectName} / problems`}
                                problemSlug={environment.problem.identifier}
                                environmentSlug={environment.openshiftProjectName}
                                projectSlug={environment.project.name}
                            />
                        </Breadcrumbs>
                        <div className="content-wrapper">
                            <NavTabs activeTab="problems" environment={environment} />
                            <div className="content">
                                <Problem problem={problem} display="slug" />
                            </div>
                        </div>
                        <style jsx>{`
                            .content-wrapper {
                                @media ${bp.tabletUp} {
                                    display: flex;
                                    padding: 0;
                                }
                            }
                            .content {
                                width: 100%;
                            }
                      `}</style>
                    </MainLayout>
                )
            })}
        </Query>
    </>);
};

export default withRouter(PageProblem);
