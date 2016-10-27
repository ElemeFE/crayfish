class DataTable extends Jinkela {
  get template() {
    return `
      <div>
        <table>
          <thead ref="thead"></thead>
          <tbody ref="tbody"></tbody>
        </table>
      </div>
    `;
  }
  get styleSheet() {
    return `
      :scope {
        flex: 1;
        overflow: auto;
        margin-bottom: 2em;
        table {
          width: 100%;
          font-size: 12px;
          border: 1px solid #ebe6e1;
          border-collapse: collapse;
          tr {
            &:hover td {
              transition: background-color 200ms ease;
              background-color: #f6f6f6;
            }
          }
          th, td {
            text-align: left;
            border: solid #ebe6e1;
            border-width: 1px 0;
          }
          td {
            color: #666;
            padding: 12px 8px;
          }
          th {
            font-weight: normal;
            background: #faf5f5;
            padding: 8px 8px;
            color: #999;
          }
          a + a {
            margin-left: 1em;
          }
        }
      }
    `;
  }
  applyFilter() {
    let keys = Object.keys(this.filters);
    this.data.forEach(item => {
      item.isVisible = keys.every(key => {
        return this.filters[key].test(item[key]);
      });
    });
  }
  setFilter(filedName, value) {
    this.filters[filedName] = value;
    this.applyFilter();
  }
}
