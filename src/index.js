import React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import "./index.css";

class Table extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [],
            rows: [],
            selectedRow: null,
            filterStr: null,
            sortedBy: null,
            sortDirection: null,
            columnWidth: {}
        };

        this.columnHeaders = {};
        this.columnWidth = {};

        this._resizeColumns = this._resizeColumns.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        return {
            columns: props.columns,
            rows: props.rows.map((row, index) => ({...row, id: index}))
        }
    }

    _setColumnWidth(e, column) {
        if (e) {
            if (this.columnWidth[column] !== e.offsetWidth) {
                this.columnWidth[column] = e.offsetWidth;
                this.setState({columnWidth: this.columnWidth});
                console.log("set size for column");
                console.log(column);
                console.log(e.offsetWidth);
            }

            if (!this.columnHeaders[column]) {
                this.columnHeaders[column] = e;
            }
        }
    }

    _resizeColumns() {
        for (let columnHeader in this.columnHeaders) {
            if (this.columnHeaders.hasOwnProperty(columnHeader)) {
                this._setColumnWidth(this.columnHeaders[columnHeader], columnHeader);
            }
        }
    }

    _tableOrderBy(fieldName, rows, sortedBy, sortDirection) {
        const fieldSortDirection = sortedBy === fieldName && sortDirection === "asc" ? "desc" : "asc";

        const orderedRows = [...rows].sort((a, b) => {
            if (a[fieldName] > b[fieldName]) {
                return fieldSortDirection === "asc" ? 1 : -1;
            }
            if (a[fieldName] < b[fieldName]) {
                return fieldSortDirection === "asc" ? -1 : 1;
            }
            return 0;
        });

        this.setState({
            rows: orderedRows,
            sortedBy: fieldName,
            sortDirection: fieldSortDirection
        })
    }

    _getArrowClassName(field) {
        return this.state.sortedBy === field ?
            (this.state.sortDirection === "asc" ? "arrow-down" : "arrow-up")
            : ""
    }

    _isInSearch(element, searchString) {
        if (searchString !== null && searchString !== "") {
            const search = searchString.toLowerCase();
            const fields = Object.keys(element);

            let isInSearch = false;
            fields.forEach(field => {
                if (String(element[field]).toLowerCase().includes(search)) {
                    isInSearch = true;
                }
            });

            return (
                searchString === null
                || searchString === ""
                || isInSearch
            )
        }

        return true;
    }

    _highlightText(text, textToHighlight) {
        const regex = new RegExp(textToHighlight, "gi");
        const match = text.match(regex);
        let matchedText = "";
        if (match !== null) {
            matchedText = match[0];
        }
        return (textToHighlight !== null && textToHighlight !== "") ?
            text.replace(regex, "<span class='selected-text'>" + matchedText + "</span>") :
            text
    }

    _renderTableHead() {
        return (
            <div className="table-head-wrapper" key="table-head-wrapper">
                <table>
                    <thead>
                    <tr>
                        {
                            /**
                             * @param column:object
                             * @param column.field:string
                             * @param column.title:string
                             */
                            this.props.columns.map((column, index) => {
                                return (
                                    <th className={
                                        index === 0 ? "first-column" :
                                            (index === this.props.columns.length - 1 ? "last-column" : null)
                                    }
                                        key={index} width={this.state.columnWidth[column.field]}>
                                        <div onClick={() =>
                                            this._tableOrderBy(column.field, this.state.rows, this.state.sortedBy, this.state.sortDirection)
                                        }><span className="column-title">{column.title}</span>
                                            <div className={this._getArrowClassName(column.field)}/>
                                        </div>
                                    </th>
                                )
                            })}
                    </tr>
                    </thead>
                </table>
            </div>
        )
    }

    _renderTableBody() {
        return (
            <div className="table-body-wrapper" key="table-body-wrapper">
                <ReactResizeDetector handleWidth onResize={this._resizeColumns}/>
                <table>
                    <thead>
                    <tr>
                        {this.props.columns.map((column, index) => {
                            return (
                                <th className={index === 0 ? "first-column" : (index === this.props.columns.length - 1 ? "last-column" : null)}
                                    key={index} ref={(e) => this._setColumnWidth(e, column.field)}>
                                    <div><span className="column-title">{column.title}</span>
                                        <div className={this._getArrowClassName(column.field)}/>
                                    </div>
                                </th>
                            )
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.rows.map((element, index) => {
                        if (this._isInSearch(element, this.props.filterStr)) {
                            return (
                                <tr
                                    key={index}
                                    onClick={() => {
                                        if (this.state.selectedRow !== element.id) {
                                        } else {
                                            this.setState({selectedRow: null});
                                        }
                                    }}
                                    className={element.id === this.state.selectedRow ? "active" : ""}>
                                    {this.props.columns.map((column, index) => {
                                            return (
                                                <td
                                                    key={index}
                                                    className={
                                                        index === 0 ? "first-column" :
                                                            (index === this.props.columns.length - 1 ?
                                                                "last-column" : "")
                                                    }
                                                    dangerouslySetInnerHTML={{
                                                        __html: this._highlightText(element[column.field], this.props.filterStr)
                                                    }}/>
                                            )
                                        }
                                    )}
                                </tr>
                            )
                        }

                        return null;
                    })}
                    </tbody>
                </table>
            </div>
        )
    }

    render() {
        const BodyWrapper = this.props.bodyWrapper;

        return (
            <div className="table-wrapper">
                {[
                    this._renderTableHead(),
                    BodyWrapper ?
                        <BodyWrapper>{this._renderTableBody()}</BodyWrapper> : this._renderTableBody()
                ]}
            </div>
        );
    }
}
export default Table;
