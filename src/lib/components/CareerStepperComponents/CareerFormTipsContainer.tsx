'use client'

import React from "react";
import hilight from '../../../../public/iconsV3/hilight.svg';

type Props = {
    children?: any,
}

export default function CareerFormTipsContainer(props: Props) {

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="layered-card-middle">

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="la la-lightbulb"
                            style={{
                                // WebkitBackgroundClip: 'text',
                                // backgroundClip: 'text',
                                // color: 'transparent',
                                // backgroundColor: 'linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%)',
                                fontSize: 23
                            }}
                        ></i>
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