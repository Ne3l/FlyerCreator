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
const MARGIN_EDITABLE_TEXT = 16;

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
        const {
            color,
            fontFamily,
            fontSize,
            italic,
            bold,
            letterSpace,
            lineHeight,
            align,
            text,
            width,
            left,
            top,
            cropping,
            height,
            changeItem,
            type,
            rotate,
            zoom
        } = this.props;

        if (type === TYPES_EDITABLE.CONTAINER) {
            return (
                <Rotable
                    width={width}
                    height={height}
                    left={left}
                    top={top}
                    visible={!cropping}
                    degrees={rotate}
                    onChange={degrees => changeItem({ rotate: degrees })}
                >
                    <Resizable
                        visible={!cropping}
                        width={width}
                        height={height}
                        left={left}
                        top={top}
                        onChange={changeItem}
                        TOP_LEFT
                        TOP_CENTER
                        TOP_RIGHT
                        LEFT_CENTER
                        RIGHT_CENTER
                        BOTTOM_LEFT
                        BOTTOM_CENTER
                        BOTTOM_RIGHT
                    >
                        {this.renderContainer()}
                    </Resizable>
                </Rotable>
            );
        }

        if (type === TYPES_EDITABLE.IMAGE) {
            return (
                <Rotable
                    width={width}
                    height={height}
                    left={left}
                    top={top}
                    visible={!cropping}
                    degrees={rotate}
                    onChange={degrees => changeItem({ rotate: degrees })}
                >
                    <Resizable
                        visible={!cropping}
                        width={width}
                        height={height}
                        left={left}
                        top={top}
                        onChange={changeItem}
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
                width={width - MARGIN_EDITABLE_TEXT}
                height={fontSize * lineHeight - MARGIN_EDITABLE_TEXT}
                left={left - MARGIN_EDITABLE_TEXT}
                top={top - MARGIN_EDITABLE_TEXT}
                visible={!cropping}
                degrees={rotate}
                onChange={degrees => changeItem({ rotate: degrees })}
            >
                <Resizable
                    visible={!cropping}
                    width={width}
                    height={height}
                    left={left}
                    top={top}
                    onChange={changeItem}
                    LEFT_CENTER
                    RIGHT_CENTER
                >
                    <ContentEditable
                        html={text}
                        style={{
                            fontSize: fontSize,
                            color: color,
                            fontWeight: bold ? 'bold' : 'normal',
                            fontStyle: italic ? 'italic' : 'normal',
                            fontFamily: fontFamily,
                            letterSpacing: `${letterSpace / 100}em`,
                            lineHeight: `${lineHeight}`,
                            textAlign: cls({
                                left: align === ALIGN.LEFT,
                                center: align === ALIGN.CENTER,
                                right: align === ALIGN.RIGHT
                            }),
                            transform: `translateY(0em) scale(${zoom})`,
                            transformOrigin: 'left top 0px'
                        }}
                        onChange={ev => changeItem({ text: ev.target.value })}
                    >
                        {text}
                    </ContentEditable>
                </Resizable>
            </Rotable>
        );
    }

    renderContainer() {
        const { backgroundColor, width, height } = this.props;

        return <div style={{ backgroundColor, width, height }} />;
    }

    renderChildren() {
        const { color, fontFamily, fontSize, italic, bold, letterSpace, lineHeight, align, zoom, type } = this.props;

        if (type === TYPES_EDITABLE.CONTAINER) {
            return this.renderContainer();
        }

        if (type === TYPES_EDITABLE.IMAGE) {
            return this.renderImg();
        }
        return (
            <div
                style={{
                    color: color,
                    fontFamily: fontFamily,
                    fontSize: fontSize,
                    fontStyle: italic ? 'italic' : 'normal',
                    fontWeight: bold ? 'bold' : 'normal',
                    letterSpacing: `${letterSpace / 100}em`,
                    lineHeight: `${lineHeight}`,
                    textAlign: cls({
                        left: align === ALIGN.LEFT,
                        center: align === ALIGN.CENTER,
                        right: align === ALIGN.RIGHT
                    }),
                    transform: `translateY(0em) scale(${zoom}`,
                    transformOrigin: 'left top 0px'
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
            x = x - MARGIN_EDITABLE_TEXT * zoom;
            y = y - MARGIN_EDITABLE_TEXT * zoom;
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
                            [`rotateZ(${rotate}deg)`]: rotate !== 0
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
