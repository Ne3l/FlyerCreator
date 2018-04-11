import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css';

const mapStateToProps = (state, props) => {
    return {
        zoom: state.zoom
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        changeZoom(zoom) {
            dispatch({ type: 'CHANGE_ZOOM', zoom });
        }
    };
};

const STEPS = [10, 25, 50, 63, 75, 83, 100, 125, 150, 175, 200, 300];

class ZoomController extends Component {
    render() {
        const { zoom } = this.props;
        return (
            <div className="ZoomController">
                <button onClick={e => this.props.changeZoom(STEPS[Math.max(STEPS.findIndex(e => e === zoom), 1) - 1])}>
                    -
                </button>
                {zoom} %
                <button
                    onClick={e =>
                        this.props.changeZoom(STEPS[Math.min(STEPS.findIndex(e => e === zoom), STEPS.length - 2) + 1])
                    }
                >
                    +
                </button>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZoomController);
