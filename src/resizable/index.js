import React from 'react';
import { POSITIONS } from '../Constantes';
import './index.css';

export const Resizable = ({
    children,
    onMouseDown,
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    LEFT_CENTER,
    RIGHT_CENTER,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT
}) => {
    return (
        <React.Fragment>
            {TOP_LEFT && (
                <div
                    className="arrow top left"
                    onMouseDown={onMouseDown(POSITIONS.TOP_LEFT)}
                    style={{ top: -10, left: -10 }}
                />
            )}
            {TOP_CENTER && (
                <div
                    className="arrow top"
                    onMouseDown={onMouseDown(POSITIONS.TOP_CENTER)}
                    style={{ top: -10, left: 'calc(50% - 10px)' }}
                />
            )}
            {TOP_RIGHT && (
                <div
                    className="arrow top right"
                    onMouseDown={onMouseDown(POSITIONS.TOP_RIGHT)}
                    style={{ top: -10, right: -10 }}
                />
            )}
            {LEFT_CENTER && (
                <div
                    className="arrow left"
                    onMouseDown={onMouseDown(POSITIONS.LEFT_CENTER)}
                    style={{ bottom: 'calc(50% - 10px)', left: -10 }}
                />
            )}
            {children}

            {RIGHT_CENTER && (
                <div
                    className="arrow right"
                    onMouseDown={onMouseDown(POSITIONS.RIGHT_CENTER)}
                    style={{ bottom: 'calc(50% - 10px)', right: -10 }}
                />
            )}
            {BOTTOM_LEFT && (
                <div
                    className="arrow bottom left"
                    onMouseDown={onMouseDown(POSITIONS.BOTTOM_LEFT)}
                    style={{ bottom: -10, left: -10 }}
                />
            )}
            {BOTTOM_CENTER && (
                <div
                    className="arrow bottom"
                    onMouseDown={onMouseDown(POSITIONS.BOTTOM_CENTER)}
                    style={{ bottom: -10, left: 'calc(50% - 10px)' }}
                />
            )}
            {BOTTOM_RIGHT && (
                <div
                    className="arrow bottom right"
                    onMouseDown={onMouseDown(POSITIONS.BOTTOM_RIGHT)}
                    style={{ bottom: -10, right: -10 }}
                />
            )}
        </React.Fragment>
    );
};
