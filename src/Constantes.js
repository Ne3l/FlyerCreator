export const POSITIONS = {
    TOP_LEFT: 0,
    TOP_CENTER: 1,
    TOP_RIGHT: 2,
    BOTTOM_LEFT: 3,
    BOTTOM_CENTER: 4,
    BOTTOM_RIGHT: 5,
    LEFT_CENTER: 6,
    RIGHT_CENTER: 7
};

export const TYPES_EDITABLE = {
    TEXT: 'TEXT',
    IMAGE: 'IMAGE',
    CONTAINER: 'CONTAINER'
};

export const ALIGN = {
    LEFT: 'Izquierda',
    CENTER: 'Centro',
    RIGHT: 'Derecha'
};

export const TECLAS_ESPECIALES = {
    BACK: 8,
    COMMA: 188,
    DELETE: 46,
    INSERT: 45,
    DASH: 109,
    DASH_KEYPAD: 189,
    ENTER: 13,
    END: 35,
    ESCAPE: 27,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    HOME: 36, // inicio
    KEY_UP: 38,
    KEY_DOWN: 40,
    KEY_LEFT: 37,
    KEY_RIGHT: 39,
    TAB: 9,
    ALT: 18,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    SPACE_BAR: 32
};

export const SIZES = {
    A4: {
        96: {
            width: 794 - 1,
            height: 1123 - 1
        }
    }
};

export const DEFAULTS_TYPE_OBJ = {
    TEXT: {
        type: TYPES_EDITABLE.TEXT,
        editing: false,
        text: 'Lorem Ipsum',
        top: 0,
        left: 0,
        width: 150,
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
    },
    IMAGE: {
        type: TYPES_EDITABLE.IMAGE,
        editing: false,
        cropping: false,
        src: null,
        name: null,
        top: 0,
        left: 0,
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
    },
    CONTAINER: {
        type: TYPES_EDITABLE.CONTAINER,
        editing: false,
        top: 0,
        left: 0,
        backgroundColor: '#fff',
        borderColor: '#333',
        borderStyle: 'solid',
        borderWidth: 1,
        width: 150,
        height: 100,
        rotate: 0,
        zIndex: 1
    }
};
