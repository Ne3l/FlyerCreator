import React from 'react';
import { connect } from 'react-redux';
import './index.css';

const mapStateToProps = (state, props) => {
    return {
        zoom: state.zoom * 100
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        changeZoom(zoom) {
            dispatch({ type: 'CHANGE_ZOOM', zoom: zoom / 100 });
        }
    };
};

const STEPS = [25, 50, 63, 75, 83, 100, 125, 150, 175, 200, 300];

const ZoomController = ({ zoom, changeZoom }) => {
    return (
        <div className="ZoomController">
            <button onClick={e => changeZoom(STEPS[Math.max(STEPS.findIndex(e => e === zoom), 1) - 1])}>-</button>
            {zoom} %
            <button onClick={e => changeZoom(STEPS[Math.min(STEPS.findIndex(e => e === zoom), STEPS.length - 2) + 1])}>
                +
            </button>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ZoomController);
