import React, { Component } from 'react';
import './Galeria.css';
import { TYPES_EDITABLE } from './Constantes';

class Galeria extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            error: null
        };
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
        // this.preview(img);
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

    printContainer = e => {
        const container = document.body.querySelectorAll('.Editor')[0];

        const myWindow = window.open();
        myWindow.document.write(container.innerHTML);

        myWindow.setTimeout(() => {
            myWindow.print();
            myWindow.close();
        }, 500);
    };

    render() {
        return (
            <div
                className="Galeria"
                ref={container => {
                    this.container = container;
                }}
                onDragLeave={this.handleDragLeave}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
            >
                <div className="btn-add-file">
                    <input
                        ref={input => {
                            this.fileInput = input;
                        }}
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
                    <button onClick={this.printContainer}> Imprimir</button>
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
            </div>
        );
    }
}

export default Galeria;
