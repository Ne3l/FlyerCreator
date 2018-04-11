import React, { Component, Fragment } from 'react';
import ColorPicker from './Picker.jsx';
import './Input.css';

class ColorInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    handleClick = e => {
        e.preventDefault();
        if (this.props.disabled !== true) {
            this.setState({ isOpen: !this.state.isOpen });
        }
    };

    handleChange = color => {
        if (typeof this.props.handleChange === 'function') this.props.handleChange(color.hex);
        this.props.onChange(color.hex);
    };

    handleBlur = e => {
        this.setState({ isOpen: false });
    };

    render() {
        let value = this.props.value || '';
        let hexColor = value.replace(/^"(.*)"$/, '$1');
        return (
            <Fragment>
                <div
                    className="form-control color-input"
                    onClick={this.handleClick}
                    disabled={this.props.disabled}
                    style={{ width: this.props.inputWidth, backgroundColor: hexColor }}
                    autoFocus={this.props.focus}
                />
                {this.state.isOpen && (
                    <ColorPicker
                        color={this.props.value}
                        onChangeComplete={this.handleChange}
                        onBlur={this.handleBlur}
                    />
                )}
            </Fragment>
        );
    }
}

export default ColorInput;
