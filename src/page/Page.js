import React, { Component } from 'react';
import { connect } from 'react-redux';
import Editable from '../editable/Editable';
import { TYPES_EDITABLE, ALIGN, SIZES } from '../Constantes';
import './Page.css';

// method extracted from https://stackoverflow.com/questions/279749/detecting-the-system-dpi-ppi-from-js-css/39795416#39795416
const getDPI = () => {
    const findFirstPositive = b => {
        let i = 1;
        let a;
        const c = (d, e) =>
            e >= d
                ? ((a = d + (e - d) / 2),
                  0 < b(a) && (a == d || 0 >= b(a - 1)) ? a : 0 >= b(a) ? c(a + 1, e) : c(d, a - 1))
                : -1;
        for (; 0 >= b(i); ) i *= 2;
        return c(i / 2, i) | 0;
    };

    return findFirstPositive(x => matchMedia(`(max-resolution: ${x}dpi)`).matches);
};

const DPI = getDPI();

const mapStateToProps = (state, props) => {
    return {
        items: state.items,
        copy: state.copy,
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
        },
        copyItem(item) {
            dispatch({ type: 'COPY_ITEM', item });
        }
    };
};

class Page extends Component {
    state = {
        height: SIZES.A4[DPI].height,
        width: SIZES.A4[DPI].width,
        topStartPage: 0,
        leftStartPage: 0
    };

    componentDidMount() {
        this.setState({
            topStartPage: this.page.offsetTop,
            leftStartPage: this.page.offsetLeft
        });
    }

    handleDrop = e => {
        const type = e.nativeEvent.dataTransfer.getData('type');
        const src = e.nativeEvent.dataTransfer.getData('src');
        const name = e.nativeEvent.dataTransfer.getData('name');

        switch (type) {
            case TYPES_EDITABLE.TEXT:
                this.props.addItem({
                    type,
                    editing: false,
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
                    letterSpace: 10,
                    zIndex: 1
                });
                break;
            case TYPES_EDITABLE.IMAGE:
                this.props.addItem({
                    type,
                    editing: false,
                    cropping: false,
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
                    brightness: 100,
                    zIndex: 1
                });
                break;
            case TYPES_EDITABLE.CONTAINER:
                this.props.addItem({
                    type,
                    editing: false,
                    top: e.clientY,
                    left: e.clientX,
                    backgroundColor: '#000',
                    borderColor: '#333',
                    borderStyle: 'solid',
                    borderWidth: 1,
                    width: 300,
                    height: 100,
                    rotate: 0,
                    zIndex: 1
                });
                break;
            default:
                break;
        }

        e.preventDefault();
        e.stopPropagation();
    };

    handlePaste = e => {
        if (!this.props.copy) return;
        this.props.addItem({
            ...this.props.copy,
            left: this.props.copy.left + 20,
            top: this.props.copy.top + 20
        });
    };

    handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    renderItems() {
        return this.props.items.map(item => (
            <Editable
                key={item.id}
                onDelete={this.props.removeItem}
                onStartEdit={this.props.startEdit}
                onToggleCrop={this.props.toggleCrop}
                changeItem={this.props.changeItem}
                topStartPage={this.state.topStartPage}
                leftStartPage={this.state.leftStartPage}
                copyItem={e => {
                    this.props.copyItem(item);
                }}
                zoom={this.props.zoom}
                {...item}
            />
        ));
    }

    render() {
        const { zoom } = this.props;
        return (
            <div
                className="page"
                ref={page => (this.page = page)}
                onPaste={this.handlePaste}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
                style={{
                    width: this.state.width * zoom,
                    height: this.state.height * zoom
                }}
            >
                {this.renderItems()}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
