import cls from 'classnames';
import React, { Component } from 'react';
import { ALIGN, TECLAS_ESPECIALES, TYPES_EDITABLE } from '../Constantes';
import ContentEditable from '../ContentEditable';
import './Editable.css';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { Resizable } from '../resizable';
import { Rotable } from '../rotable';
import { Movable } from '../movable';

const NOOP = () => {};

let cropper;

class Editable extends Component {
    componentDidUpdate(prevProps, prevState) {
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
                    width={this.props.width}
                    height={this.props.height}
                    left={this.props.left}
                    top={this.props.top}
                    visible={!this.props.cropping}
                    degrees={this.props.rotate}
                    onChange={degrees => this.props.changeItem({ rotate: degrees })}
                >
                    <Resizable
                        visible={!this.props.cropping}
                        width={this.props.width}
                        height={this.props.height}
                        left={this.props.left}
                        top={this.props.top}
                        onChange={this.props.changeItem}
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

        const marginEditableText = 15;
        return (
            <Rotable
                width={this.props.width - marginEditableText}
                height={this.props.fontSize * this.props.lineHeight - marginEditableText}
                left={this.props.left - marginEditableText}
                top={this.props.top - marginEditableText}
                visible={!this.props.cropping}
                degrees={this.props.rotate}
                onChange={degrees => this.props.changeItem({ rotate: degrees })}
            >
                <Resizable
                    visible={!this.props.cropping}
                    width={this.props.width}
                    height={this.props.height}
                    left={this.props.left}
                    top={this.props.top}
                    onChange={this.props.changeItem}
                    LEFT_CENTER
                    RIGHT_CENTER
                >
                    <ContentEditable
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
            x = x - 16 * zoom;
            y = y - 16 * zoom;
        }

        return { x, y };
    }

    render() {
        const { top, left, height, width, type, zoom, editing, rotate } = this.props;

        const cords = this.getCords();
        return (
            <Movable onChange={this.props.changeItem} left={left} top={top} type={type}>
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
                    style={{
                        width: type === TYPES_EDITABLE.TEXT ? width : width * zoom,
                        height: type === TYPES_EDITABLE.IMAGE && !editing ? height * zoom : undefined,
                        transform: cls(`translate(${cords.x}px,${cords.y}px)`, {
                            [`rotate(${rotate}deg)`]: rotate !== 0,
                            [`translateY(0em) scale(${zoom}`]: type === TYPES_EDITABLE.TEXT
                        }),
                        transformOrigin: cls({
                            'left top 0px': type === TYPES_EDITABLE.TEXT
                        })
                    }}
                >
                    {editing ? this.renderEditBox() : this.renderChildren()}
                </div>
            </Movable>
        );
    }
}

Editable.defaultProps = {
    onEndEdit: NOOP,
    onToggleCrop: NOOP,
    onDelete: NOOP
};

export default Editable;
