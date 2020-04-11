export default class Location {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    getRow() {
        return this.row;
    }

    getColumn() {
        return this.column;
    }
}
