class Main extends Jinkela {
  @autobind onFilterChange({ target: { name, value } }) {
    try {
      value = new RegExp(value);
    } catch (e) {
      value = new RegExp();
    }
    this.dataTable.setFilter(name, value);
  }
  init() {
    this.update();
  }
  update() {
    this.element.innerHTML = '';
    let { domain } = new UParams();
    if (!domain) return location.pathname = '/default/';
    new Caption({ text: domain }).renderTo(this);
    let dataTable = this.dataTable = new ClientList();
    let { onFilterChange } = this;
    new ControlBar({ onFilterChange, dataTable, parent: this }).renderTo(this);
    this.dataTable.renderTo(this);
  }
  get styleSheet() {
    return `
      :scope {
        display: flex;
        height: 100%;
        flex-direction: column;
      }
    `;
  }
}
