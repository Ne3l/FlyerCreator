import React, { Component } from 'react';
import { throttle } from 'lodash';
import { TYPES_EDITABLE } from '../Constantes';
import './index.css';

export class Movable extends Component {
    state = {
        moving: false,
        cordX: 0,
        cordY: 0
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.moving !== prevState.moving) {
            if (this.state.moving) {
                this.addDocumentListeners();
            } else {
                this.removeDocumentListeners();
            }
        }
    }

    componentWillUnmount() {
        if (this.state.moving) {
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
        this.setState({
            moving: false,
            cordX: 0,
            cordY: 0
        });
    };

    handleMouseDown = e => {
        if (this.props.type === TYPES_EDITABLE.IMAGE) {
            e.preventDefault();
        }
        if (this.props.type === TYPES_EDITABLE.TEXT && e.target.contentEditable === 'true') return;

        this.setState({
            moving: true,
            cordX: e.clientX - this.props.left,
            cordY: e.clientY - this.props.top
        });
    };

    handleMouseMove = throttle(e => {
        const { cordX, cordY, moving } = this.state;

        if (moving) {
            this.props.onChange({
                top: e.clientY - cordY,
                left: e.clientX - cordX
            });
        }
    }, 10);

    render() {
        const { children } = this.props;
        return React.cloneElement(children, {
            onMouseDown: (...args) => {
                this.handleMouseDown(...args);
                if (children.props.onMouseDown) children.props.onMouseDown(...args);
            }
        });
    }
}

Movable.defaultProps = {
    visible: true
};
