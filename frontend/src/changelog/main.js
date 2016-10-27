class Main extends Jinkela {
  @autobind onFilterChange({ target: { name, value } }) {
    try {
      value = new RegExp(value);
    } catch (e) {
      value = new RegExp();
    }
    this.dataTable.setFilter(name, value);
  }
  async init() {
    new ControlBar({ onFilterChange: this.onFilterChange, parent: this }).renderTo(this);
    this.dataTable = new LogList({ parent: this }).renderTo(this);
    let { id, domain } = new UParams();
    let response = await fetch(`/api/domains/${domain}/${id}`, { credentials: 'include' });
    if (response.status < 400) {
      let data = await response.json();
      this.h1.textContent = '/' + data.domain + data.path + ':' + data.name;
    }
  }
  get template() {
    return `
      <div>
        <h1 ref="h1"></h1>
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
