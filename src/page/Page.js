import React, { Component } from 'react';
import { connect } from 'react-redux';
import Editable from '../editable/Editable';
import { TYPES_EDITABLE, ALIGN } from '../Constantes';
import { EditBarText, EditBarImg } from '../editBar/EditBar';
import './Page.css';

const mapStateToProps = (state, props) => {
    return {
        items: state.items,
        zoom: state.zoom
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        addItem(item) {
            dispatch({ type: 'ADD_ITEM', item });
        },
        removeItem({ id }) {
            dispatch({ type: 'REMOVE_ITEM', id });
        },
        startEdit({ id }) {
            dispatch({ type: 'START_EDIT', id });
        },
        changeItem(item) {
            dispatch({ type: 'CHANGE_ITEM', item });
        }
    };
};

class Page extends Component {
    state = {
        maxWidth: null,
        maxHeight: null
    };

    componentDidMount() {
        this.setState({
            maxWidth: this.page.clientWidth,
            maxHeight: this.page.clientHeight
        });
    }
    handleDrop = e => {
        const type = e.nativeEvent.dataTransfer.getData('type');
        const src = e.nativeEvent.dataTransfer.getData('src');
        const name = e.nativeEvent.dataTransfer.getData('name');

        switch (type) {
            case TYPES_EDITABLE.TEXT:
                this.props.addItem({
                    editing: false,
                    type: TYPES_EDITABLE.TEXT,
                    text: 'Lorem Ipsum',
                    top: e.clientY,
                    left: e.clientX,
                    width: 300,
                    fontSize: 12,
                    fontFamily: 'Open Sans',
                    color: '#000',
                    rotate: 0,
                    bold: false,
                    italic: false,
                    align: ALIGN.LEFT,
                    lineHeight: 1.4,
                    letterSpace: 20
                });
                break;
            case TYPES_EDITABLE.IMAGE:
                this.props.addItem({
                    editing: false,
                    cropping: false,
                    type: TYPES_EDITABLE.IMAGE,
                    src,
                    name,
                    top: e.clientY,
                    left: e.clientX,
                    width: 150,
                    height: 150,
                    rotate: 0,
                    rotateX: false,
                    rotateY: false,
                    sepia: 0,
                    gray: 0,
                    saturation: 100,
                    contrast: 100,
                    opacity: 100,
                    brightness: 100
                });
                break;
            default:
                break;
        }

        e.preventDefault();
        e.stopPropagation();
    };

    handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    renderItems() {
        return this.props.items.map(item => (
            <Editable
                onDelete={this.props.removeItem}
                onStartEdit={this.props.startEdit}
                onToggleCrop={this.props.toggleCrop}
                changeItem={this.props.changeItem}
                key={item.id}
                topStartPage={this.page.offsetTop}
                leftStartPage={this.page.offsetLeft}
                {...item}
            />
        ));
    }

    renderEditBar() {
        const editItem = this.props.items.find(e => e.editing);

        if (!editItem) return <div className="EditBar" />;

        if (editItem.type === TYPES_EDITABLE.TEXT) {
            return (
                <EditBarText
                    fontFamily={editItem.fontFamily}
                    fontSize={editItem.fontSize}
                    color={editItem.color}
                    italic={editItem.italic}
                    bold={editItem.bold}
                    align={editItem.align}
                    lineHeight={editItem.lineHeight}
                    letterSpace={editItem.letterSpace}
                    onChange={this.props.changeItem}
                    changeCapitalization={e => {
                        const selection = window.getSelection().toString();
                        this.props.changeItem({ text: editItem.text.split(selection).join(selection.toUpperCase()) });
                    }}
                />
            );
        }

        if (editItem.type === TYPES_EDITABLE.IMAGE) {
            return (
                <EditBarImg
                    sepia={editItem.sepia}
                    gray={editItem.gray}
                    saturation={editItem.saturation}
                    contrast={editItem.contrast}
                    opacity={editItem.opacity}
                    brightness={editItem.brightness}
                    rotateX={editItem.rotateX}
                    rotateY={editItem.rotateY}
                    onChange={this.props.changeItem}
                    crop={e => this.props.toggleCrop({ id: editItem.id })}
                />
            );
        }
    }

    render() {
        const { maxHeight, maxWidth } = this.state;
        const { zoom } = this.props;
        return (
            <div
                className="page"
                ref={page => (this.page = page)}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
                style={{
                    width: maxWidth ? maxWidth * 0.7 * (zoom / 100) : undefined,
                    height: maxHeight ? maxHeight * (zoom / 100) : undefined,
                    transform: `scale(${zoom / 100})`
                }}
            >
                {this.renderItems()}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
