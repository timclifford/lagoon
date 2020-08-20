import React from 'react';
import Link from 'next/link';

export const getLinkData = (problemSlug, environmentSlug, projectSlug) => ({
  urlObject: {
    pathname: '/problem',
    query: { identifier: problemSlug, openshiftProjectName: environmentSlug }
  },
  asPath: `/projects/${projectSlug}/${environmentSlug}/problems/${problemSlug}`
});

/**
 * Links to a problem page given the problem id and the openshift project name.
 */
const ProblemLink = ({
  problemSlug,
  environmentSlug,
  projectSlug,
  children,
  className = null,
  prefetch = false,
}) => {
    const linkData = getLinkData(problemSlug, environmentSlug, projectSlug);

    return (
        <>
        <Link href={linkData.urlObject} as={linkData.asPath} prefetch={prefetch}>
            <a className={className}>{children}</a>
        </Link>
        <style jsx>{`
            .more {
              background: none;
              border: none;
              color: #2bc0d8;
              padding: 5px 0;
              text-transform: uppercase;
              font-size: 0.8em;
              cursor: pointer;
            }
        `}</style>
        </>
    );
};

export default ProblemLink;
