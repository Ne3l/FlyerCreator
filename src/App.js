import React, { Component } from 'react';
import Galeria from './Galeria';
import Editor from './Editor';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from './reducers';

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <React.Fragment>
                    <Galeria />
                    <Editor />
                </React.Fragment>
            </Provider>
        );
    }
}

export default App;
