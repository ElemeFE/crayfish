class Welcome extends Jinkela {
  init() {
    this.update();
  }
  update() {
    let { domain = '' } = new UParams();
    switch (true) {
      case domain && location.pathname === '/':
        return location.pathname = '/domain/';
      default:
        this.element.innerHTML = '<h1>Crayfish</h1>';
    }
  }
  get styleSheet() {
    return `
      :scope {
        margin: 2em 0;
        line-height: initial;
      }
    `;
  }
}
