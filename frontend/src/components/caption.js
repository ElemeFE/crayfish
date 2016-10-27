class Caption extends Jinkela {
  init() {
    this.element.textContent = this.text;
  }
  get template() {
    return `<h1></h1>`;
  }
}
