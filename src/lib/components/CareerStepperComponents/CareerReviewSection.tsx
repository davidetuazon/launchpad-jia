'use client'

import React, { useState } from "react"

type Props = {
    title: string,
    steps: any,
    children: any,
}

export default function CareerReviewSection({ title, steps, children }: Props) {
    const [open, setOpen] = useState(true);

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 24, alignItems: "flex-start", marginTop: 26 }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
                <div className="layered-card-middle">
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'space-between', gap: 8, padding: '0px 5px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
                            <div
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fc", borderRadius: "60px", cursor: "pointer", width: 32, height: 32, }}
                            onClick={() => setOpen(prev => !prev)}
                            >
                                <i
                                    className={open ? 'la la-angle-up' : 'la la-angle-down'}
                                    style={{ fontSize: 20, fontWeight: 700 }}
                                ></i>
                            </div>
                            <span style={{fontSize: 19, color: "#181D27", fontWeight: 700}}>{title}</span>
                        </div>
                        <div
                        style={{ border: "1px solid #dadbdeff",  display: "flex", alignItems: "center", justifyContent: "center", background: "#ffff", borderRadius: "60px", cursor: "pointer", width: 32, height: 32, }}
                        onClick={() => console.log('clicked')}
                        >
                            <i className="la la-pencil-alt" style={{ fontSize: 20, fontWeight: 700 }}></i>
                        </div>
                    </div>
                    {open && (
                        <div className="layered-card-content">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}