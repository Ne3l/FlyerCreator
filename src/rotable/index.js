import React, { Component } from 'react';
import './index.css';
import { throttle } from 'lodash';

export class Rotable extends Component {
    state = {
        rotating: false,
        widthStart: 0,
        heightStart: 0,
        leftStart: 0,
        topStart: 0
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.rotating !== prevState.rotating) {
            if (this.state.rotating) {
                this.addDocumentListeners();
            } else {
                this.removeDocumentListeners();
            }
        }
    }

    componentWillUnmount() {
        if (this.state.rotating) {
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
            rotating: false,
            widthStart: 0,
            heightStart: 0,
            leftStart: 0,
            topStart: 0
        });
    };

    handleMouseDown = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            rotating: true,
            widthStart: this.props.width,
            heightStart: this.props.height,
            leftStart: this.props.left,
            topStart: this.props.top
        });
    };

    handleMouseMove = throttle(e => {
        const { widthStart, heightStart, leftStart, topStart, rotating } = this.state;

        if (rotating) {
            const imgCenter = { x: leftStart + widthStart / 2, y: topStart + heightStart / 2 };
            let angle = Math.atan2(imgCenter.y - e.clientY, imgCenter.x - e.clientX) * 180 / Math.PI + 90;
            if (angle < 0) angle = 360 + angle;

            this.props.onChange(Math.floor(angle));
        }
    }, 10);

    render() {
        const { visible, children, degrees } = this.props;
        return (
            <React.Fragment>
                {children}
                {visible && (
                    <div
                        className="rotate"
                        onMouseDown={this.handleMouseDown}
                        style={{
                            transform: `rotate(${360 - degrees}deg)`
                        }}
                    >
                        {Math.floor(degrees)}°
                    </div>
                )}
            </React.Fragment>
        );
    }
}

Rotable.defaultProps = {
    visible: true
};
