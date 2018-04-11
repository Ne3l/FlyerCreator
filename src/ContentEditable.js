import React from 'react';

import { isEqual } from 'lodash';

let stripNbsp = str => str.replace(/&nbsp;|\u202F|\u00A0/g, ' ');

export default class ContentEditable extends React.Component {
    render() {
        const { disabled, onBlur, children, ...props } = this.props;

        return (
            <div
                {...props}
                className="contentEditable"
                ref={e => (this.htmlEl = e)}
                onInput={this.emitChange}
                onBlur={onBlur || this.emitChange}
                contentEditable={!disabled}
                suppressContentEditableWarning
            >
                {children}
            </div>
        );
    }

    shouldComponentUpdate(nextProps) {
        let { props, htmlEl } = this;

        if (stripNbsp(nextProps.html) !== stripNbsp(htmlEl.innerText) && nextProps.html !== props.html) {
            return true;
        }

        let optional = ['style', 'className', 'disabled'];

        // Handle additional properties
        return optional.some(name => !isEqual(props[name], nextProps[name]));
    }

    componentDidUpdate() {
        if (this.htmlEl && this.props.html !== this.htmlEl.innerText) {
            this.htmlEl.innerText = this.props.html;
        }
    }

    emitChange = evt => {
        var html = this.htmlEl.innerText;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange({
                ...evt,
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    };
}
