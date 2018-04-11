import React, { Component } from 'react';
import color from 'react-color/lib/helpers/color';
import { Saturation, Hue, EditableInput, ColorWrap } from 'react-color/lib/components/common';
import BlockSwatches from 'react-color/lib/components/block/BlockSwatches';

class ColorPicker extends Component {
    componentDidMount() {
        this.nameDiv.focus();
        document.addEventListener('click', this.handleClickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, false);
    }

    handleClickOutside = e => {
        if (!this.nameDiv.contains(e.target)) {
            this.props.onBlur(e);
        }
    };

    handleChange = (hexCode, e) => {
        if (color.isValidHex(hexCode)) {
            this.props.onChange({ hex: hexCode, source: 'hex' }, e);
        }
    };

    render() {
        const { hex, hsl, hsv, colors, width } = this.props;
        return (
            <div
                ref={div => (this.nameDiv = div)}
                className="block-picker"
                style={{
                    width,
                    background: '#fff',
                    boxShadow: '2px 1px 4px 1px rgba(0,0,0,.1)',
                    borderRadius: '6px',
                    position: 'absolute',
                    outline: 'none',
                    zIndex: '1'
                }}
                tabIndex="-1"
            >
                <div
                    style={{
                        height: '110px',
                        background: hex,
                        borderRadius: '6px 6px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{ width: '100%', paddingBottom: '65%', position: 'relative', overflow: 'hidden' }}>
                        <Saturation
                            style={{ radius: '2px 2px 0 0' }}
                            hsl={hsl}
                            hsv={hsv}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div style={{ padding: '10px' }}>
                    <div style={{ height: '10px', position: 'relative', marginBottom: '10px' }}>
                        <Hue style={{ radius: '2px' }} hsl={hsl} onChange={this.handleChange} />
                    </div>
                    <BlockSwatches colors={colors} onClick={this.handleChange} />
                    <EditableInput
                        placeholder="Hex Code"
                        style={{
                            input: {
                                width: '100%',
                                fontSize: '12px',
                                color: '#666',
                                border: '0px',
                                outline: 'none',
                                height: '22px',
                                boxShadow: 'inset 0 0 0 1px #ddd',
                                borderRadius: '4px',
                                padding: '0 7px',
                                boxSizing: 'border-box'
                            }
                        }}
                        value={hex}
                        onChange={this.handleChange}
                    />
                </div>
            </div>
        );
    }
}

ColorPicker.defaultProps = {
    width: '170px',
    colors: [
        '#E7505A',
        '#F2784B',
        '#F4D03F',
        '#26C281',
        '#5C9BD1',
        '#C8D046',
        '#BFBFBF',
        '#8877A9',
        '#BF55EC',
        '#2F353B'
    ],
    triangle: 'top'
};

export default ColorWrap(ColorPicker);
