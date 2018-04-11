import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Editor.css';
import { TYPES_EDITABLE } from './Constantes';
import { EditBarText, EditBarImg } from './editBar/EditBar';
import Page from './page/Page';
import ZoomController from './zoomController';

const mapStateToProps = (state, props) => {
    return {
        items: state.items
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        toggleCrop({ id }) {
            dispatch({ type: 'TOGGLE_CROP', id });
        },
        changeItem(item) {
            dispatch({ type: 'CHANGE_ITEM', item });
        },
        stopEdit(e) {
            dispatch({ type: 'STOP_EDIT' });
        }
    };
};

class Editor extends Component {
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
        return (
            <div className="Editor">
                {this.renderEditBar()}
                <ZoomController />
                <div className="content" onClick={this.props.stopEdit}>
                    <Page />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
