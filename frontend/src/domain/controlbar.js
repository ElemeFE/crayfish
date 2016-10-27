class ControlBar extends Jinkela {
  init() {
    let { onFilterChange, dataTable } = this;
    new FilterBar({ onFilterChange }).renderTo(this);
    new ActionBar({ dataTable, parent: this }).renderTo(this);
  }
  get styleSheet() {
    return `
      :scope {
        height: 50px;
        line-height: 50px;
        overflow: hidden;
      }
    `;
  }
}
