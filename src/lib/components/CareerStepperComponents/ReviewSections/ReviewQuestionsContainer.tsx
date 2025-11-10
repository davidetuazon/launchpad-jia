'use client'

import React, { useEffect } from "react"

type Props = {
    title: any,
    questions: any,
}

export default function ReviewQuestionsContainer({ title, questions }: Props) {

    return (
        <div style={{ gap: 10 }}>
            <span style={{ color: 'black', fontSize: 16, fontWeight: 500 }}>{title}</span>
            <div style={{ display: 'block' }}>
                <ol style={{ listStyleType: 'decimal' }}>
                    {questions.map((q) => (
                        <li key={q.id} style={{ display: 'list-item' }}>
                            <span>{q.question}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
}