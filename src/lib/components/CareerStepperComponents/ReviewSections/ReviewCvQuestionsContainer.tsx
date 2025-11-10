'use client'

import React, { useEffect } from "react"

type Props = {
    title: any,
    type: any,
    options: any,
}

export default function ReviewCvQuestionsContainer({ title, type, options }: Props) {
    

    return (
        <div style={{ gap: 10 }}>
            <span style={{ color: 'black', fontSize: 16, fontWeight: 500 }}>{title}</span>
            <span style={{ color: 'black', fontSize: 16, fontWeight: 500 }}>{type}</span>
            <div style={{ display: 'block' }}>
                <ol style={{ listStyleType: 'decimal' }}>
                    {options.map((opt) => (
                        <li key={opt.id} style={{ display: 'list-item' }}>
                            <span>{opt.label}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
}