function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        }
        return state;
    };
}

const addItem = (state, action) => {
    return {
        ...state,
        items: [
            ...state.items,
            {
                ...action.item,
                id: Math.random()
                    .toString(36)
                    .substring(2, 15)
            }
        ]
    };
};

const removeItem = (state, action) => {
    return {
        ...state,
        items: state.items.filter(e => e.id !== action.id)
    };
};

const startEdit = (state, action) => {
    return {
        ...state,
        items: state.items.map(e => ({ ...e, editing: e.id === action.id }))
    };
};

const stopEdit = (state, action) => {
    return {
        ...state,
        items: state.items.map(e => ({ ...e, editing: false }))
    };
};

const toggleCrop = (state, action) => {
    return {
        ...state,
        items: state.items.map(e => ({ ...e, cropping: e.id === action.id && !e.cropping }))
    };
};

const changeItem = (state, action) => {
    return {
        ...state,
        items: state.items.map(e => {
            if (e.editing) {
                return {
                    ...e,
                    ...action.item
                };
            }
            return e;
        })
    };
};

const changeZoom = (state, action) => {
    return {
        ...state,
        zoom: action.zoom
    };
};

export const reducer = createReducer(
    {
        items: [],
        zoom: 100
    },
    {
        ADD_ITEM: addItem,
        REMOVE_ITEM: removeItem,
        START_EDIT: startEdit,
        STOP_EDIT: stopEdit,
        TOGGLE_CROP: toggleCrop,
        CHANGE_ITEM: changeItem,
        CHANGE_ZOOM: changeZoom
    }
);
