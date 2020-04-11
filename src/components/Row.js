import React from "react";

export default class Row extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={"flex three"}>
            {(() => {
                const rows = [];
                for (let i = 0; i < this.props.columns; i++) {
                    rows.push(<div onClick={() => {this.props.onTileClick(this.props.currentRow, i)}}>
                        <div className={"tile-failure"}>
                            <img className={"failure-img"} src={"cross.svg"}/>
                        </div>
                        <div className={"tile"} id={`tile_${this.props.currentRow}_${i}`}>
                            {this.props.hideTiles || !this.props.rowData[i]? "" : this.props.rowData[i]}
                            <span className={"tile-text"}>45</span>
                        </div>
                    </div>);
                }
                return rows;
            })()}
        </div>
    }
}
