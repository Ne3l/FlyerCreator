import cls from 'classnames';
import React, { Component } from 'react';
import { ALIGN, POSITIONS, TECLAS_ESPECIALES, TYPES_EDITABLE } from '../Constantes';
import ContentEditable from '../ContentEditable';
import './Editable.css';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { throttle } from 'lodash';

let cropper;

class Editable extends Component {
    state = {
        resize: false,
        position: null,
        move: false,
        rotating: false,
        widthStart: false,
        heightStart: false,
        leftStart: null,
        topStart: null,
        cordX: null,
        cordY: null
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.move !== prevState.move) {
            if (this.state.move) {
                this.addDocumentListeners();
            } else {
                this.removeDocumentListeners();
            }
        }
        if (this.state.resize !== prevState.resize) {
            if (this.state.resize) {
                this.addDocumentListeners();
            } else {
                this.removeDocumentListeners();
            }
        }

        if (this.state.rotating !== prevState.rotating) {
            if (this.state.rotating) {
                this.addDocumentListeners();
            } else {
                this.removeDocumentListeners();
            }
        }

        if (this.props.cropping !== prevProps.cropping) {
            if (this.props.cropping) {
                cropper = new Cropper(this.image, {});
            } else if (cropper) {
                const canvas = cropper.getCroppedCanvas();
                this.props.changeItem({
                    src: canvas.toDataURL(),
                    width: cropper.cropBoxData.width,
                    height: cropper.cropBoxData.height,
                    top: this.props.top + cropper.cropBoxData.top,
                    left: this.props.left + cropper.cropBoxData.left
                });
                cropper.destroy();
                cropper = null;
            }
        }
        if (this.props.editing !== prevProps.editing && this.props.editing) {
            this.container.focus();
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

    handleMouseDownArrow = position => e => {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.cropping) return;
        this.setState({
            resize: true,
            position,
            widthStart: this.props.width,
            heightStart: this.props.height,
            leftStart: this.props.left,
            topStart: this.props.top,
            cordX: e.clientX,
            cordY: e.clientY
        });
    };

    handleMouseUp = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            resize: false,
            position: null,
            move: false,
            rotating: false,
            widthStart: null,
            heightStart: null,
            leftStart: null,
            topStart: null,
            cordX: null,
            cordY: null
        });
    };

    handleMouseMove = throttle(e => {
        const {
            cordX,
            cordY,
            widthStart,
            heightStart,
            leftStart,
            topStart,
            position,
            resize,
            move,
            rotating
        } = this.state;
        if (resize) {
            switch (position) {
                case POSITIONS.TOP_LEFT:
                    this.props.changeItem({
                        width: Math.max(widthStart + cordX - e.clientX, 0),
                        height: Math.max(heightStart + cordY - e.clientY, 0),
                        top: Math.min(topStart + heightStart, topStart - cordY + e.clientY),
                        left: Math.min(leftStart + widthStart, leftStart - cordX + e.clientX)
                    });
                    break;
                case POSITIONS.TOP_CENTER:
                    this.props.changeItem({
                        height: Math.max(heightStart + cordY - e.clientY, 0),
                        top: Math.min(topStart + heightStart, topStart - cordY + e.clientY)
                    });
                    break;
                case POSITIONS.TOP_RIGHT:
                    this.props.changeItem({
                        width: Math.max(widthStart + e.clientX - cordX, 0),
                        height: Math.max(heightStart + cordY - e.clientY, 0),
                        top: Math.min(topStart + heightStart, topStart - cordY + e.clientY)
                    });
                    break;
                case POSITIONS.LEFT_CENTER:
                    this.props.changeItem({
                        width: Math.max(widthStart + cordX - e.clientX, 0),
                        left: Math.min(leftStart + widthStart, leftStart - cordX + e.clientX)
                    });
                    break;
                case POSITIONS.RIGHT_CENTER:
                    this.props.changeItem({ width: Math.max(widthStart + e.clientX - cordX, 0) });
                    break;
                case POSITIONS.BOTTOM_LEFT:
                    this.props.changeItem({
                        width: Math.max(widthStart + cordX - e.clientX, 0),
                        height: Math.max(heightStart + e.clientY - cordY, 0),
                        left: Math.min(leftStart + widthStart, leftStart - cordX + e.clientX)
                    });
                    break;
                case POSITIONS.BOTTOM_CENTER:
                    this.props.changeItem({ height: Math.max(heightStart + e.clientY - cordY, 0) });
                    break;
                case POSITIONS.BOTTOM_RIGHT:
                    this.props.changeItem({
                        width: Math.max(widthStart + e.clientX - cordX, 0),
                        height: Math.max(heightStart + e.clientY - cordY, 0)
                    });
                    break;
                default:
                    break;
            }
        }
        if (move) {
            this.props.changeItem({
                top: e.clientY - cordY,
                left: e.clientX - cordX
            });
        }
        if (rotating) {
            const imgCenter = { x: leftStart + widthStart / 2, y: topStart + heightStart / 2 };
            let angle = Math.atan2(imgCenter.y - e.clientY, imgCenter.x - e.clientX) * 180 / Math.PI + 95; // 95? Funciona pero buscar porque.
            if (angle < 0) angle = 360 + angle;

            this.props.changeItem({ rotate: angle });
        }
    }, 10);

    handleKeyDown = e => {
        let tecla = e.which ? e.which : e.keyCode;
        if (this.props.type === TYPES_EDITABLE.TEXT && this.props.editing && e.target.contentEditable === 'true')
            return;

        if (tecla === TECLAS_ESPECIALES.DELETE) {
            this.props.onDelete({ id: this.props.id });
        }
    };

    renderEditBox() {
        if (this.props.type === TYPES_EDITABLE.IMAGE) {
            return (
                <React.Fragment>
                    <div
                        className="arrow right"
                        onMouseDown={this.handleMouseDownArrow(POSITIONS.TOP_LEFT)}
                        style={{ top: -10, left: -10 }}
                    />
                    <div
                        className="arrow top"
                        onMouseDown={this.handleMouseDownArrow(POSITIONS.TOP_CENTER)}
                        style={{ top: -10, left: 'calc(50% - 10px)' }}
                    />
                    <div
                        className="arrow left"
                        onMouseDown={this.handleMouseDownArrow(POSITIONS.TOP_RIGHT)}
                        style={{ top: -10, right: -10 }}
                    />
                    <div
                        className="arrow vertical"
                        onMouseDown={this.handleMouseDownArrow(POSITIONS.LEFT_CENTER)}
                        style={{ bottom: 'calc(50% - 10px)', left: -10 }}
                    />
                    <div style={{ display: 'block' }}>
                        <img
                            ref={image => (this.image = image)}
                            src={this.props.src}
                            style={{
                                width: this.props.width,
                                height: this.props.height,
                                transform: cls({
                                    'rotateX(180deg)': this.props.rotateX,
                                    'rotateY(180deg)': this.props.rotateY
                                }),
                                filter: cls({
                                    [`sepia(${this.props.sepia}%)`]: this.props.sepia,
                                    [`grayscale(${this.props.gray}%)`]: this.props.gray,
                                    [`saturate(${this.props.saturation}%)`]: this.props.saturation !== 100,
                                    [`brightness(${this.props.brightness}%)`]: this.props.brightness !== 100,
                                    [`opacity(${this.props.opacity}%)`]: this.props.opacity !== 100,
                                    [`contrast(${this.props.contrast}%)`]: this.props.contrast !== 100
                                })
                            }}
                            alt="img"
                            className={cls('image-preview', { cropping: this.props.cropping })}
                        />
                    </div>

                    <div
                        className="arrow vertical"
                        onMouseDown={this.handleMouseDownArrow(POSITIONS.RIGHT_CENTER)}
                        style={{ bottom: 'calc(50% - 10px)', right: -10 }}
                    />
                    <div
                        className="arrow left"
                        onMouseDown={this.handleMouseDownArrow(POSITIONS.BOTTOM_LEFT)}
                        style={{ bottom: -10, left: -10 }}
                    />
                    <div
                        className="arrow bottom"
                        onMouseDown={this.handleMouseDownArrow(POSITIONS.BOTTOM_CENTER)}
                        style={{ bottom: -10, left: 'calc(50% - 10px)' }}
                    />
                    <div
                        className="arrow right"
                        onMouseDown={this.handleMouseDownArrow(POSITIONS.BOTTOM_RIGHT)}
                        style={{ bottom: -10, right: -10 }}
                    />
                    <div
                        className="rotate"
                        onMouseDown={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (this.props.cropping) return;
                            this.setState({
                                rotating: true,
                                widthStart: this.props.width,
                                heightStart: this.props.height,
                                leftStart: this.props.left,
                                topStart: this.props.top
                            });
                        }}
                        style={{
                            transform: `rotate(${360 - this.props.rotate}deg)`
                        }}
                    >
                        {Math.floor(this.props.rotate)}°
                    </div>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <div
                    className="arrow vertical"
                    onMouseDown={this.handleMouseDownArrow(POSITIONS.LEFT_CENTER)}
                    style={{ bottom: 'calc(50% - 10px)', left: -10 }}
                />

                <ContentEditable
                    ref={contentEditable => (this.contentEditable = contentEditable)}
                    html={this.props.text}
                    style={{
                        fontSize: this.props.fontSize,
                        color: this.props.color,
                        fontWeight: this.props.bold ? 'bold' : 'normal',
                        fontStyle: this.props.italic ? 'italic' : 'normal',
                        fontFamily: this.props.fontFamily,
                        letterSpacing: `${this.props.letterSpace / 100}em`,
                        lineHeight: `${this.props.lineHeight}`,
                        textAlign: cls({
                            left: this.props.align === ALIGN.LEFT,
                            center: this.props.align === ALIGN.CENTER,
                            right: this.props.align === ALIGN.RIGHT
                        })
                    }}
                    onChange={ev => this.props.changeItem({ text: ev.target.value })}
                >
                    {this.props.text}
                </ContentEditable>

                <div
                    className="arrow vertical"
                    onMouseDown={this.handleMouseDownArrow(POSITIONS.RIGHT_CENTER)}
                    style={{ bottom: 'calc(50% - 10px)', right: -10 }}
                />
                <div
                    className="rotate"
                    onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (this.props.cropping) return;
                        this.setState({
                            rotating: true,
                            widthStart: this.props.width,
                            heightStart: this.contentEditable.htmlEl.offsetHeight,
                            leftStart: this.props.left,
                            topStart: this.props.top
                        });
                    }}
                    style={{
                        transform: `rotate(${360 - this.props.rotate}deg)`
                    }}
                >
                    {Math.floor(this.props.rotate)}°
                </div>
            </React.Fragment>
        );
    }

    renderChildren() {
        if (this.props.type === TYPES_EDITABLE.IMAGE) {
            return (
                <img
                    ref={image => (this.image = image)}
                    src={this.props.src}
                    style={{
                        width: this.props.width,
                        height: this.props.height,
                        transform: cls({
                            'rotateX(180deg)': this.props.rotateX,
                            'rotateY(180deg)': this.props.rotateY
                        }),
                        filter: cls({
                            [`sepia(${this.props.sepia}%)`]: this.props.sepia,
                            [`grayscale(${this.props.gray}%)`]: this.props.gray,
                            [`saturate(${this.props.saturation}%)`]: this.props.saturation !== 100,
                            [`brightness(${this.props.brightness}%)`]: this.props.brightness !== 100,
                            [`opacity(${this.props.opacity}%)`]: this.props.opacity !== 100,
                            [`contrast(${this.props.contrast}%)`]: this.props.contrast !== 100
                        })
                    }}
                    alt="img"
                    className="image-preview"
                />
            );
        }
        return (
            <div
                style={{
                    color: this.props.color,
                    fontFamily: this.props.fontFamily,
                    fontSize: this.props.fontSize,
                    fontStyle: this.props.italic ? 'italic' : 'normal',
                    fontWeight: this.props.bold ? 'bold' : 'normal',
                    letterSpacing: `${this.props.letterSpace / 100}em`,
                    lineHeight: `${this.props.lineHeight}`,
                    textAlign: cls({
                        left: this.props.align === ALIGN.LEFT,
                        center: this.props.align === ALIGN.CENTER,
                        right: this.props.align === ALIGN.RIGHT
                    })
                }}
            >
                {this.props.text}
            </div>
        );
    }

    render() {
        const { top, topStartPage, leftStartPage, left, width, height, type, editing } = this.props;
        return (
            <div
                ref={container => (this.container = container)}
                className={cls('container-editable', { editing, move: this.state.move })}
                onClick={e => this.props.onStartEdit({ id: this.props.id })}
                onKeyDown={this.handleKeyDown}
                tabIndex="0"
                onMouseDown={e => {
                    if (type === TYPES_EDITABLE.IMAGE) {
                        e.preventDefault();
                    }
                    if (type === TYPES_EDITABLE.TEXT && editing && e.target.contentEditable === 'true') return;
                    e.stopPropagation();
                    this.setState({ move: true, cordX: e.clientX - left, cordY: e.clientY - top });
                }}
                style={{
                    // width: width,
                    // height: height,
                    transform: cls(`translate(${left - leftStartPage}px,${top - topStartPage}px)`, {
                        [`rotate(${Math.floor(this.props.rotate)}deg)`]: this.props.rotate !== 0
                    })
                }}
            >
                {editing ? this.renderEditBox() : this.renderChildren()}
            </div>
        );
    }
}

export default Editable;
