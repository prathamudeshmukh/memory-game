import React from "react";
import {ANSWER_STATUS_RIGHT, ANSWER_STATUS_WRONG} from "../Constants";

export default class Row extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={"flex three"}>
            {(() => {
                const rows = [];
                console.log('this.props.rowData',this.props.rowData)
                for (let i = 0; i < this.props.columns; i++) {
                    let failureMessage = "hide";
                    let tileClass = this.props.hideTiles || !this.props.rowData[i] ? "hide" : "show";
                    if (this.props.answersGiven[i] === ANSWER_STATUS_WRONG) {
                        failureMessage = "show";
                    }
                    if (this.props.answersGiven[i] === ANSWER_STATUS_RIGHT) {
                        tileClass = "show";
                    }
                    rows.push(
                        <div onClick={() => {this.props.onTileClick(this.props.currentRow, i)}}>
                            <div className={`tile-failure ${failureMessage}`}>
                                <img className={"failure-img"} src={"cross.svg"}/>
                            </div>
                            <div className={"tile"} id={`tile_${this.props.currentRow}_${i}`}>
                                <span className={`tile-text ${tileClass}`}>
                                    {this.props.rowData[i]}
                                </span>
                            </div>
                        </div>);
                }
                return rows;
            })()}
        </div>
    }
}
