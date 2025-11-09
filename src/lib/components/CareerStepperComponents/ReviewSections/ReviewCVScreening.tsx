'use client'

import React from "react";

type Props = {
    formData: any,
}

export default function ReviewCVSCreening({ formData }: Props) {

    // helper for applying bottom border :D
    const containerStyleHelper = (type: 'flex' | 'grid', isLast: boolean) => ({
        ...(type === 'flex' ? styles.flexContainer : styles.gridContainer),
        borderBottom: isLast ? 'none' : '2px solid #e4e6e9ff',
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* CV SCREENING SETTING */}
            <div style={containerStyleHelper('flex', false)}>
                <div style={styles.content}>
                    <span style={styles.title}>CV Screening</span>
                    <span >Automatically endorses candidates who are {formData?.cvScreeningSetting}</span>
                </div>
            </div>

            {/* PRE-SCREENING QUESTIONS */}
            <div style={containerStyleHelper('flex', true)}>
                <div style={styles.content}>
                    <span style={styles.title}>Pre-Screening Questions</span>
                    <span style={styles.title}>
                        TODO: Finish the add pre-screening questions logic
                        <br/>
                        DEADLINE: Tomorrow, November 10, 2025
                    </span>
                </div>
            </div>
        </div>
    )
}

const styles: {[key: string]: React.CSSProperties} = {
    flexContainer: {
        padding: '20px 0px',
        borderBottom: '2px solid #e4e6e9ff',
    },
    gridContainer: {
        padding: '20px 0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
        borderBottom: '2px solid #e4e6e9ff',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    title: {
        fontSize: 16,
        color: "#181D27",
        fontWeight: 700,
    }
}