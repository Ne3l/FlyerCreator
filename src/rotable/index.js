import React from 'react';
import './index.css';

export const Rotable = ({ children, onMouseDown, degrees }) => {
    return (
        <React.Fragment>
            {children}
            <div
                className="rotate"
                onMouseDown={onMouseDown}
                style={{
                    transform: `rotate(${360 - degrees}deg)`
                }}
            >
                {Math.floor(degrees)}°
            </div>
        </React.Fragment>
    );
};
