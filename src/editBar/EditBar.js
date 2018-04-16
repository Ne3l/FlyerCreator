import React from 'react';
import ColorInput from '../color/Input';
import { ALIGN } from '../Constantes';
import './EditBar.css';

const FONT_SIZES = [6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 88, 96, 104, 120, 144];

export const EditBarImg = ({
    rotateX,
    rotateY,
    crop,
    sepia,
    onChange,
    gray,
    saturation,
    contrast,
    opacity,
    brightness
}) => {
    const change = props => onChange(props);
    const changeSlider = name => ev => change({ [name]: parseInt(ev.target.value, 10) });

    return (
        <div className="EditBar">
            <button onClick={e => onChange({ rotateX: !rotateX })}> Girar horizontalmente</button>
            <button onClick={e => onChange({ rotateY: !rotateY })}> Girar verticalmente</button>
            <button onClick={crop}> Recortar</button>
            <div className="filtrosImg">
                <div className="containerFiltro">
                    Sepia: {sepia}
                    <input type="range" min={0} max={100} value={sepia} onChange={changeSlider('sepia')} />
                </div>
                <div className="containerFiltro">
                    Grises: {gray}
                    <input type="range" min={0} max={100} value={gray} onChange={changeSlider('gray')} />
                </div>
                <div className="containerFiltro">
                    Saturacion: {saturation}
                    <input type="range" min={0} max={200} value={saturation} onChange={changeSlider('saturation')} />
                </div>
                <div className="containerFiltro">
                    Contraste: {contrast}
                    <input type="range" min={0} max={200} value={contrast} onChange={changeSlider('contrast')} />
                </div>
                <div className="containerFiltro">
                    Opacidad: {opacity}
                    <input type="range" min={0} max={100} value={opacity} onChange={changeSlider('opacity')} />
                </div>
                <div className="containerFiltro">
                    Brillo: {brightness}
                    <input type="range" min={0} max={100} value={brightness} onChange={changeSlider('brightness')} />
                </div>
            </div>
        </div>
    );
};

export const EditBarContainer = ({ backgroundColor, onChange }) => {
    const change = props => onChange(props);
    return (
        <div className="EditBar">
            <ColorInput
                value={backgroundColor}
                onChange={color => {
                    change({ backgroundColor: color });
                }}
            />
        </div>
    );
};

export const EditBarText = ({
    color,
    bold,
    align,
    italic,
    fontSize,
    fontFamily,
    letterSpace,
    lineHeight,
    onChange,
    changeCapitalization
}) => {
    const change = props => onChange(props);
    const changeSlider = name => ev => change({ [name]: parseInt(ev.target.value, 10) });

    return (
        <div className="EditBar">
            <select
                onChange={e => {
                    change({ fontFamily: e.target.value });
                }}
                value={fontFamily}
            >
                <option value={'Open Sans'}>Open Sans</option>
                <option value={'sans-serif'}>Sans serif</option>
                <option value={'monospace'}>Monospace</option>
            </select>
            <select
                onChange={e => {
                    change({ fontSize: parseInt(e.target.value, 10) });
                }}
                value={fontSize}
            >
                {FONT_SIZES.map(e => (
                    <option key={e} value={e}>
                        {e}
                    </option>
                ))}
            </select>
            <ColorInput
                value={color}
                onChange={color => {
                    change({ color });
                }}
            />
            <button onClick={e => change({ bold: !bold })}> Bold</button>
            <button onClick={e => change({ italic: !italic })}> Italic</button>
            <select onChange={e => change({ align: e.target.value })} value={align}>
                {Object.values(ALIGN).map(e => <option key={e}>{e}</option>)}
            </select>
            <button onClick={changeCapitalization}>Mayus/Min</button>
            <div className="containerFiltro">
                Espaciado Letras: {letterSpace}
                <input type="range" min={0} max={100} value={letterSpace} onChange={changeSlider('letterSpace')} />
            </div>
            <div className="containerFiltro">
                Altura Linea: {lineHeight}
                <input
                    type="range"
                    min={0.5}
                    step={0.1}
                    max={3}
                    value={lineHeight}
                    onChange={ev => change({ lineHeight: parseFloat(ev.target.value, 10) })}
                />
            </div>
        </div>
    );
};
