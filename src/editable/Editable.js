import cls from 'classnames';
import React, { Component } from 'react';
import { ALIGN, POSITIONS, TECLAS_ESPECIALES, TYPES_EDITABLE } from '../Constantes';
import ContentEditable from '../ContentEditable';
import './Editable.css';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { throttle } from 'lodash';
import { Resizable } from '../resizable';
import { Rotable } from '../rotable';

const NOOP = () => {};

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
        if (this.props.editing !== prevProps.editing) {
            if (this.props.editing) {
                this.container.focus();
            } else {
                this.props.onEndEdit();
            }
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

            this.props.changeItem({ rotate: Math.floor(angle) });
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

    renderImg() {
        const {
            src,
            width,
            height,
            rotateX,
            rotateY,
            sepia,
            gray,
            saturation,
            brightness,
            opacity,
            contrast,
            zoom
        } = this.props;
        return (
            <img
                ref={image => (this.image = image)}
                src={src}
                style={{
                    width: width * zoom,
                    height: height * zoom,
                    transform: cls({
                        'rotateX(180deg)': rotateX,
                        'rotateY(180deg)': rotateY
                    }),
                    filter: cls({
                        [`sepia(${sepia}%)`]: sepia,
                        [`grayscale(${gray}%)`]: gray,
                        [`saturate(${saturation}%)`]: saturation !== 100,
                        [`brightness(${brightness}%)`]: brightness !== 100,
                        [`opacity(${opacity}%)`]: opacity !== 100,
                        [`contrast(${contrast}%)`]: contrast !== 100
                    })
                }}
                alt="img"
                className={cls('image-preview', { cropping: this.props.cropping })}
            />
        );
    }

    renderEditBox() {
        if (this.props.type === TYPES_EDITABLE.IMAGE) {
            return (
                <Rotable
                    onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.setState({
                            rotating: true,
                            widthStart: this.props.width,
                            heightStart: this.props.height,
                            leftStart: this.props.left,
                            topStart: this.props.top
                        });
                    }}
                    visible={!this.props.cropping}
                    degrees={this.props.rotate}
                >
                    <Resizable
                        onMouseDown={this.handleMouseDownArrow}
                        visible={!this.props.cropping}
                        TOP_LEFT
                        TOP_CENTER
                        TOP_RIGHT
                        LEFT_CENTER
                        RIGHT_CENTER
                        BOTTOM_LEFT
                        BOTTOM_CENTER
                        BOTTOM_RIGHT
                    >
                        <div>{this.renderImg()}</div>
                    </Resizable>
                </Rotable>
            );
        }

        return (
            <Rotable
                onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.setState({
                        rotating: true,
                        widthStart: this.props.width,
                        heightStart: this.contentEditable.htmlEl.offsetHeight,
                        leftStart: this.props.left,
                        topStart: this.props.top
                    });
                }}
                visible={!this.props.cropping}
                degrees={this.props.rotate}
            >
                <Resizable
                    visible={!this.props.cropping}
                    onMouseDown={this.handleMouseDownArrow}
                    LEFT_CENTER
                    RIGHT_CENTER
                >
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
                </Resizable>
            </Rotable>
        );
    }

    renderChildren() {
        if (this.props.type === TYPES_EDITABLE.IMAGE) {
            return this.renderImg();
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

    getCords() {
        const { top, left, topStartPage, leftStartPage, zoom, type, editing } = this.props;

        let x = (left - leftStartPage) * zoom;
        let y = (top - topStartPage) * zoom;

        if (editing && type === TYPES_EDITABLE.TEXT) {
            x = x - 16;
            y = y - 16;
        }

        return { x, y };
    }

    render() {
        const { top, left, height, width, type, zoom, editing, rotate } = this.props;

        const cords = this.getCords();
        return (
            <div
                ref={container => (this.container = container)}
                className={cls('container-editable', { editing })}
                onClick={e => {
                    e.stopPropagation();
                    this.props.onStartEdit({ id: this.props.id });
                }}
                onCopy={this.props.copyItem}
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
                    width: type === TYPES_EDITABLE.TEXT ? width : width * zoom,
                    height: type === TYPES_EDITABLE.IMAGE && !editing ? height * zoom : undefined,
                    transform: cls(`translate(${cords.x}px,${cords.y}px)`, {
                        [`rotate(${rotate}deg)`]: rotate !== 0,
                        [`scale(${zoom}`]: type === TYPES_EDITABLE.TEXT
                    }),
                    transformOrigin: cls({
                        'left top 0px': type === TYPES_EDITABLE.TEXT
                    })
                }}
            >
                {editing ? this.renderEditBox() : this.renderChildren()}
            </div>
        );
    }
}

Editable.defaultProps = {
    onEndEdit: NOOP,
    onToggleCrop: NOOP,
    onDelete: NOOP
};

export default Editable;
