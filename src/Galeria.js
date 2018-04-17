import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TYPES_EDITABLE, SIZES } from './Constantes';
import './Galeria.css';

const mapStateToProps = (state, props) => {
    return {
        zoom: state.zoom
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        changeZoom(zoom) {
            dispatch({ type: 'CHANGE_ZOOM', zoom: zoom });
        },
        addItem(item) {
            dispatch({ type: 'ADD_ITEM', item });
        }
    };
};

class Galeria extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            error: null,
            print: false,
            lastZoom: 1
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.print !== prevState.print && this.state.print) {
            if (this.props.zoom !== 1) {
                this.props.changeZoom(1);
            }
        }

        if (this.props.zoom !== prevProps.zoom) {
            if (this.state.print && this.props.zoom === 1) {
                this.printContainer();
            }
        }
    }

    preview(img) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onloadend = e => {
                resolve({ name: img.name, src: e.target.result });
            };
            reader.readAsDataURL(img);
        });
    }

    handleAdd = async images => {
        this.setState({ images: this.state.images.concat(await Promise.all([...images].map(this.preview))) });
    };

    handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        this.container.style.background = null;
        this.handleAdd(e.nativeEvent.dataTransfer.files);
    };

    handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
        this.container.style.background = '#e7ecf1';
    };

    handleDragLeave = e => {
        e.preventDefault();
        e.stopPropagation();
        this.container.style.background = null;
    };

    handleClickAddImg = e => {
        e.preventDefault();
        this.fileInput.click();
    };

    printContainer() {
        this.setState({ print: false });
        const container = document.body.querySelectorAll('.Editor .content')[0];

        const myWindow = window.open();

        const html = `
            <html>
                <head>
                    <style>
                        * {
                            box-sizing: border-box;
                        }
                        .page {
                            overflow: hidden;
                            position: relative;
                        }
                        .container-editable {
                            position: absolute;
                            outline: none;
                        }
                        body {
                            margin:0;
                        }
                    </style>
                </head>
                <body>
                    ${container.innerHTML}
                </body>
            </html>
        `;

        myWindow.document.write(html);

        myWindow.print();
        myWindow.close();

        if (this.state.lastZoom !== 1) {
            this.setState({ lastZoom: 1 });
            this.props.changeZoom(this.state.lastZoom);
        }
    }

    render() {
        return (
            <div
                className="Galeria"
                ref={container => (this.container = container)}
                onDragLeave={this.handleDragLeave}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
            >
                <div className="btn-add-file">
                    <input
                        ref={input => (this.fileInput = input)}
                        className="inputFileHidden"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => {
                            this.handleAdd(e.target.files);
                        }}
                    />
                </div>
                <div className="edit-bar image-uploader-btn">
                    <button
                        className="btn btn-action btn-icon-only"
                        onClick={this.handleClickAddImg}
                        autoFocus={this.props.focus}
                    >
                        add
                    </button>
                    <button onClick={e => this.setState({ print: true, lastZoom: this.props.zoom })}> Imprimir</button>
                </div>
                {this.state.images.map(e => (
                    <div key={e.name} className="image">
                        <img
                            draggable
                            onDragStart={ev => {
                                ev.nativeEvent.dataTransfer.setData('type', TYPES_EDITABLE.IMAGE);
                                ev.nativeEvent.dataTransfer.setData('src', e.src);
                                ev.nativeEvent.dataTransfer.setData('name', e.name);
                            }}
                            onClick={ev => {
                                const pageDimensions = SIZES.A4[96];

                                this.props.addItem({
                                    type: TYPES_EDITABLE.IMAGE,
                                    editing: false,
                                    cropping: false,
                                    src: e.src,
                                    name: e.name,
                                    top: pageDimensions.height / 2 - ev.target.height / 2 + 106, // TODO get topStartPage and replace 106
                                    left: pageDimensions.width / 2 - ev.target.width / 2 + 356, // TODO get leftStartPage and replace 356
                                    width: ev.target.width,
                                    height: ev.target.height,
                                    rotate: 0,
                                    rotateX: false,
                                    rotateY: false,
                                    sepia: 0,
                                    gray: 0,
                                    saturation: 100,
                                    contrast: 100,
                                    opacity: 100,
                                    brightness: 100,
                                    zIndex: 1
                                });
                            }}
                            src={e.src}
                            alt="img"
                            className="image-preview"
                        />
                    </div>
                ))}
                <span
                    draggable
                    onDragStart={ev => {
                        ev.nativeEvent.dataTransfer.setData('type', TYPES_EDITABLE.TEXT);
                    }}
                    className="textDraggable"
                >
                    Texto
                </span>

                <span
                    draggable
                    onDragStart={ev => {
                        ev.nativeEvent.dataTransfer.setData('type', TYPES_EDITABLE.CONTAINER);
                    }}
                    className="textDraggable"
                >
                    Container
                </span>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Galeria);
