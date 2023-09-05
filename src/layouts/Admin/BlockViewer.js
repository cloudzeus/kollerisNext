import React, { useState } from 'react';
import { classNames } from 'primereact/utils';
import { AppCodeHighlight } from './AppCodeHighlight';

const BlockViewer = (props) => {

    const [blockView, setBlockView] = useState('PREVIEW')

    const copyCode = async (event) => {
        if (!codeDisabled) {
            await navigator.clipboard.writeText(props.code);
        }

        event.preventDefault();
    }

    const codeDisabled = props.free ? false : ((process && process.env.NODE_ENV === 'production') || false);

    return (
        <div className="block-section">
            <div className="block-header">
                <span className="block-title">
                    <span>{props.header}</span>
                    {props.free && <span className="badge-free">Free</span>}
                    {props.new && <span className="badge-new">New</span>}
                </span>
                <div className="block-actions">
                    <a tabIndex={0} className={classNames({ 'block-action-active': blockView === 'PREVIEW' })} onClick={() => setBlockView('PREVIEW')}><span>Preview</span></a>
                    <a className={classNames({ 'block-action-active': blockView === 'CODE', 'block-action-disabled p-disabled': codeDisabled })} onClick={() => setBlockView('CODE')} disabled={codeDisabled} >
                        {codeDisabled && <i className="pi pi-lock"></i>}
                        <span>Code</span>
                    </a>
                    <a tabIndex={codeDisabled ? null : "0"} disabled={codeDisabled} className={classNames('block-action-copy', { 'block-action-disabled p-disabled': codeDisabled })} onClick={copyCode}>
                        <i className="pi pi-copy"></i>
                    </a>
                </div>
            </div>
            <div className="block-content">
                {blockView === 'PREVIEW' &&
                    <div className={props.containerClassName} style={props.previewStyle}>
                        {props.children}
                    </div>}

                {blockView === 'CODE' && !codeDisabled &&
                    <AppCodeHighlight>
                        {props.code}
                    </AppCodeHighlight>
                }
            </div>
        </div>
    )
}

export default BlockViewer;
