import React, { Component } from 'react';
import './App.css';
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
                <div className="App">
                    <Galeria />
                    <Editor />
                </div>
            </Provider>
        );
    }
}

export default App;
