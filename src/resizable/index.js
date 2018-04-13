import React, { Component } from 'react';
import { POSITIONS } from '../Constantes';
import { throttle } from 'lodash';
import './index.css';

export class Resizable extends Component {
    state = {
        resizing: false,
        widthStart: 0,
        heightStart: 0,
        leftStart: 0,
        topStart: 0,
        cordX: 0,
        cordY: 0
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.resizing !== prevState.resizing) {
            if (this.state.resizing) {
                this.addDocumentListeners();
            } else {
                this.removeDocumentListeners();
            }
        }
    }

    componentWillUnmount() {
        if (this.state.resizing) {
            this.removeDocumentListeners();
        }
    }

    addDocumentListeners() {
        document.addEventListener('mousemove', this.handleMouseMove, false);
        document.addEventListener('mouseup', this.handleMouseUp, false);
    }

    removeDocumentListeners() {
        document.removeEventListener('mousemove', this.handleMouseMove, false);
        document.removeEventListener('mouseup', this.handleMouseUp, false);
    }

    handleMouseUp = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            resizing: false,
            widthStart: 0,
            heightStart: 0,
            leftStart: 0,
            topStart: 0,
            cordX: 0,
            cordY: 0
        });
    };

    handleMouseDown = position => e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            resizing: true,
            position,
            widthStart: this.props.width,
            heightStart: this.props.height,
            leftStart: this.props.left,
            topStart: this.props.top,
            cordX: e.clientX,
            cordY: e.clientY
        });
    };

    handleMouseMove = throttle(e => {
        const { cordX, cordY, widthStart, heightStart, leftStart, topStart, position, resizing } = this.state;

        if (resizing) {
            switch (position) {
                case POSITIONS.TOP_LEFT:
                    this.props.onChange({
                        width: Math.max(widthStart + cordX - e.clientX, 0),
                        height: Math.max(heightStart + cordY - e.clientY, 0),
                        top: Math.min(topStart + heightStart, topStart - cordY + e.clientY),
                        left: Math.min(leftStart + widthStart, leftStart - cordX + e.clientX)
                    });
                    break;
                case POSITIONS.TOP_CENTER:
                    this.props.onChange({
                        height: Math.max(heightStart + cordY - e.clientY, 0),
                        top: Math.min(topStart + heightStart, topStart - cordY + e.clientY)
                    });
                    break;
                case POSITIONS.TOP_RIGHT:
                    this.props.onChange({
                        width: Math.max(widthStart + e.clientX - cordX, 0),
                        height: Math.max(heightStart + cordY - e.clientY, 0),
                        top: Math.min(topStart + heightStart, topStart - cordY + e.clientY)
                    });
                    break;
                case POSITIONS.LEFT_CENTER:
                    this.props.onChange({
                        width: Math.max(widthStart + cordX - e.clientX, 0),
                        left: Math.min(leftStart + widthStart, leftStart - cordX + e.clientX)
                    });
                    break;
                case POSITIONS.RIGHT_CENTER:
                    this.props.onChange({ width: Math.max(widthStart + e.clientX - cordX, 0) });
                    break;
                case POSITIONS.BOTTOM_LEFT:
                    this.props.onChange({
                        width: Math.max(widthStart + cordX - e.clientX, 0),
                        height: Math.max(heightStart + e.clientY - cordY, 0),
                        left: Math.min(leftStart + widthStart, leftStart - cordX + e.clientX)
                    });
                    break;
                case POSITIONS.BOTTOM_CENTER:
                    this.props.onChange({ height: Math.max(heightStart + e.clientY - cordY, 0) });
                    break;
                case POSITIONS.BOTTOM_RIGHT:
                    this.props.onChange({
                        width: Math.max(widthStart + e.clientX - cordX, 0),
                        height: Math.max(heightStart + e.clientY - cordY, 0)
                    });
                    break;
                default:
                    break;
            }
        }
    }, 10);

    render() {
        const {
            children,
            visible,
            TOP_LEFT,
            TOP_CENTER,
            TOP_RIGHT,
            LEFT_CENTER,
            RIGHT_CENTER,
            BOTTOM_LEFT,
            BOTTOM_CENTER,
            BOTTOM_RIGHT
        } = this.props;
        if (!visible) return children;
        return (
            <React.Fragment>
                {TOP_LEFT && (
                    <div
                        className="arrow top left"
                        onMouseDown={this.handleMouseDown(POSITIONS.TOP_LEFT)}
                        style={{ top: -10, left: -10 }}
                    />
                )}
                {TOP_CENTER && (
                    <div
                        className="arrow top"
                        onMouseDown={this.handleMouseDown(POSITIONS.TOP_CENTER)}
                        style={{ top: -10, left: 'calc(50% - 10px)' }}
                    />
                )}
                {TOP_RIGHT && (
                    <div
                        className="arrow top right"
                        onMouseDown={this.handleMouseDown(POSITIONS.TOP_RIGHT)}
                        style={{ top: -10, right: -10 }}
                    />
                )}
                {LEFT_CENTER && (
                    <div
                        className="arrow left"
                        onMouseDown={this.handleMouseDown(POSITIONS.LEFT_CENTER)}
                        style={{ bottom: 'calc(50% - 10px)', left: -10 }}
                    />
                )}
                {children}

                {RIGHT_CENTER && (
                    <div
                        className="arrow right"
                        onMouseDown={this.handleMouseDown(POSITIONS.RIGHT_CENTER)}
                        style={{ bottom: 'calc(50% - 10px)', right: -10 }}
                    />
                )}
                {BOTTOM_LEFT && (
                    <div
                        className="arrow bottom left"
                        onMouseDown={this.handleMouseDown(POSITIONS.BOTTOM_LEFT)}
                        style={{ bottom: -10, left: -10 }}
                    />
                )}
                {BOTTOM_CENTER && (
                    <div
                        className="arrow bottom"
                        onMouseDown={this.handleMouseDown(POSITIONS.BOTTOM_CENTER)}
                        style={{ bottom: -10, left: 'calc(50% - 10px)' }}
                    />
                )}
                {BOTTOM_RIGHT && (
                    <div
                        className="arrow bottom right"
                        onMouseDown={this.handleMouseDown(POSITIONS.BOTTOM_RIGHT)}
                        style={{ bottom: -10, right: -10 }}
                    />
                )}
            </React.Fragment>
        );
    }
}

Resizable.defaultProps = {
    visible: true
};
