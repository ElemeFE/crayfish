class DomainPanelNumberInput extends TextField {
  get type() { return 'number'; }
  get styleSheet() {
    return `
      :scope {
        width: 100px;
      }
    `;
  }
}

class DomainPanelNumber extends Jinkela {
  init() {
    let input = new DomainPanelNumberInput().renderTo(this);
    Object.defineProperty(this.element, 'value', {
      configurable: true,
      get() { return +input.element.value; },
      set(value) { input.element.value = value; }
    });
  }
}
