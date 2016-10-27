class TextField extends Jinkela {
  init() {
    [ 'placeholder', 'name', 'max', 'min' ]
      .filter(name => name in this).forEach(name => {
        this.element.setAttribute(name, this[name]);
      });
    this.element.addEventListener('input', this.input);
  }
  get template() { return `<input type="${this.type || 'text'}" />`; }
  @autobind input(event) {
    if (typeof this.onInput === 'function') this.onInput(event);
  }
  get styleSheet() {
    return `
      :scope {
        display: inline-block;
        box-sizing: border-box;
        border: 1px solid #ccc;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        color: #4c4c4c;
        height: 32px;
        padding: 5px;
        outline: none;
        width: 120px;
        &:focus {
          border: 1px solid #dbc6c1;
        }
      }
    `;
  }
}
