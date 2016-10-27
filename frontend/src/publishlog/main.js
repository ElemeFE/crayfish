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
  async update() {
    this.element.innerHTML = '';
    let { domain } = new UParams();
    if (!domain) return location.pathname = '/default/';
    new Caption({ text: `Publish Log of ${domain}` }).renderTo(this);
    new ControlBar({ onFilterChange: this.onFilterChange, parent: this }).renderTo(this);
    this.dataTable = new LogList({ parent: this }).renderTo(this);
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
