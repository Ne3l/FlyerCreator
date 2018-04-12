import React from 'react';
import './index.css';

export const Rotable = ({ children, onMouseDown, degrees, visible = true }) => {
    return (
        <React.Fragment>
            {children}
            {visible && (
                <div
                    className="rotate"
                    onMouseDown={onMouseDown}
                    style={{
                        transform: `rotate(${360 - degrees}deg)`
                    }}
                >
                    {Math.floor(degrees)}°
                </div>
            )}
        </React.Fragment>
    );
};
