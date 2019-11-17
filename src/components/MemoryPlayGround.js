import React from 'react';
import Row from "./Row";

export default class MemoryPlayGround extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <React.Fragment>
            {(() => {
                const rows = [];
                for (let i = 0; i < this.props.rows; i++) {
                    rows.push(<Row
                        rowData={this.props.memoryData[i] ? this.props.memoryData[i]: []}
                        hideTiles={this.props.hideTiles}
                        columns={this.props.columns}
                        onTileClick={this.props.onTileClick}
                        currentRow={i}
                    />);
                }
                return rows;
            })()}
        </React.Fragment>

    }
}
