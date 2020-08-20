import React from 'react';
import { bp, color, fontSize } from 'lib/variables';
import { getFromNowTime } from "components/Dates";
import ProblemLink from "components/link/Problem";

const ProblemCompactLink = ({ problem, environment }) => {
    const fromNowDate = getFromNowTime(problem.created);
    const columns = {
        identifier: problem.identifier,
        severity: problem.severity,
        source: problem.source,
        created: fromNowDate,
        associatedPackage: problem.associatedPackage
    };

    return (
        <div className="problem-compact-link-wrapper">
            <ProblemLink
                problemSlug={problem.id}
                environmentSlug={environment.openshiftProjectName}
                projectSlug={environment.project.name}
            >
                <div className="problem-heading cols-5">
                    {Object.keys(columns).map((item, i) => {
                        return (<div key={i} className={item}>{columns[item]}</div>)
                    })}
                </div>
            </ProblemLink>
            <style jsx>{`
                .meta-heading {
                    display: flex;
                    justify-content: space-between;
                    background: ${color.almostWhite};
                    padding: 5px 20px;
                }
                .problem-heading {
                    @media ${bp.tinyUp} {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    padding: 1em;
                    border: 1px solid ${color.almostWhite};
                    background: ${color.white};
                    cursor: pointer;
                    font-size: 14px;
                    background-image: url('/static/images/right-arrow.svg');
                    background-position: right 20px center;
                    background-repeat: no-repeat;
                    background-size: 18px 11px;
                    border: 1px solid ${color.white};
                    border-bottom: 1px solid ${color.lightestGrey};

                    &:hover {
                        border: 1px solid ${color.brightBlue};
                    }
                    &.cols-5 {
                      > div {
                        width: calc(100%/5);
                      }

                      .identifier {
                        width: 30%;
                      }
                    }
                }
            `}</style>
        </div>
    );
};

export default ProblemCompactLink;
