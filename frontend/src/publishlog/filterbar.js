class FilterBarTextField extends TextField {
  get styleSheet() {
    return `
      :scope {
        margin-right: 1em;
        transition: width 200ms ease;
        &:focus {
          border: 1px solid #dbc6c1;
          width: 200px;
        }
      }
    `;
  }
  
}

class FilterBar extends Jinkela {
  init() {
    // new FilterBarTextField({ placeholder: 'value filter', name: 'value', onInput: this.onInput }).renderTo(this);
  }
  @autobind onInput(event) {
    if (typeof this.onFilterChange === 'function') this.onFilterChange(event);
  }
  get styleSheet() {
    return `
      :scope {
        float: left;
      }
    `;
  }
}
