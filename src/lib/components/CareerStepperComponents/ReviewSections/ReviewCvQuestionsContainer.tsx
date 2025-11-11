'use client'

import React from "react"

type Props = {
    title: string,
    type: 'dropdown' | 'range',
    options: any[],
}

export default function ReviewCvQuestionsContainer({ title, type, options }: Props) {
    return (
        <div style={{ gap: 10 }}>
            <ol style={{ listStyleType: 'decimal', paddingLeft: 20 }}>
                <li style={{ fontSize: 16, marginBottom: 8 }}>
                    {title}
                    <ul style={{ listStyleType: 'disc', paddingLeft: 20, marginTop: 4 }}>
                        {options.map((opt) => (
                            <li key={opt.id} style={{ marginBottom: 4 }}>
                                {type === 'dropdown' && <span>{opt.label}</span>}
                                {type === 'range' && (
                                    <span>
                                        Preferred: PHP {opt.min?.toLocaleString()} - PHP {opt.max?.toLocaleString()}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </li>
            </ol>
        </div>
    )
}