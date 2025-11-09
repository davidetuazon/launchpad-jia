'use client'

import React from "react"

type Props = {
    children?: any,
}

export default function CareerFormTipsContainer(props: Props) {

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="layered-card-middle">

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="la la-bolt" style={{ color: "black", fontSize: 20 }}></i>
                    </div>
                        <span style={{fontSize: 19, color: "#181D27", fontWeight: 700}}>Tips</span>
                </div>
                <div className="layered-card-content">
                    {props.children}
                </div>
            </div>
        </div>
    )
}