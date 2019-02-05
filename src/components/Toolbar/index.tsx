import React, { Component } from 'react';
import './index.css';

export interface IToolbarProps {
    setModeMove: (e: any) => void;
    setModeTransition: (e: any) => void;
    setModePlace: (e: any) => void;
    exportModelAsJSON: (e: any) => void;
}

export class Toolbar extends Component<IToolbarProps, {}> {
    render() {
        return ( 
            <div className="toolbar">
                <button className="toolbar-button" onClick={this.props.setModeMove}>
                    Move
                </button>
                <button className="toolbar-button" onClick={this.props.setModeTransition}>
                    Add transition
                </button>
                <button className="toolbar-button" onClick={this.props.setModePlace}>
                    Add place
                </button>
                <button className="toolbar-button" onClick={this.props.exportModelAsJSON}>
                    Export as JSON
                </button>
            </div>
        );
    }
}

export default Toolbar;
