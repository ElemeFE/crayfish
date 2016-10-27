class ControlBar extends Jinkela {
  init() {
    let { onFilterChange } = this;
    new FilterBar({ onFilterChange }).renderTo(this);
  }
  get styleSheet() {
    return `
      :scope {
        display: none; /* no filter here */
        height: 50px;
        line-height: 50px;
        overflow: hidden;
      }
    `;
  }
}
