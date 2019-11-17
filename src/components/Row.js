import React from "react";

export default class Row extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="flex">
            {(() => {
                const rows = [];
                for (let i = 0; i < this.props.columns; i++) {
                    rows.push(<div><span>{this.props.hideTiles || !this.props.rowData[i]? "" : this.props.rowData[i]}</span></div>);
                }
                return rows;
            })()}
        </div>
    }
}
