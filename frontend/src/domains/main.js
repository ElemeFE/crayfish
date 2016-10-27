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
    let { domain } = new UParams();
    this.domain = domain;
    new ControlBar({ onFilterChange: this.onFilterChange, parent: this }).renderTo(this);
    this.dataTable = new ClientList({ parent: this }).renderTo(this);
  }
  get template() {
    return `
      <div>
        <h1>Domains</h1>
      </div>
    `;
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
