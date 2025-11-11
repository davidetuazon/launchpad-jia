'use client'

import React from "react";

type Props = {
    steps: any[],
    step: any,
}

export default function StepProgressBar({ steps, step }: Props) {

    return (
        <div
            style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    position: 'relative',
                    gap: 5,
                }}
        >
            <div 
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 12,
                }}
            >
                {steps.map((s, idx) => {
                    const isFinished = idx < step;
                    const isActive = idx === step;

                    return (
                        <div key={idx}>
                            <span
                                style={{
                                    color: isActive ? 'black'
                                        : isFinished
                                            ? 'black'
                                            : '#6A7B86',
                                    fontWeight: 700,
                                    transition: "color 0.4s ease",
                                }}
                            >
                                {steps[idx].title}{}
                            </span>
                        </div>
                    )
                })}
            </div>
            <div
                style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 10,
                    }}
            >
                {steps.map((s, idx) => {
                    const shouldFill = idx <= step;

                    return (
                         <div
                            key={idx}
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '7px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                background: '#c1c9ceff',
                            }}
                        >
                            <div
                                key={idx}
                                style={{
                                    width: shouldFill ? '100%' : '0%',
                                    height: '7px',
                                    borderRadius: '8px',
                                    transition: "width 0.8s ease",
                                    background: 'linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%)',
                                }}
                            >
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}