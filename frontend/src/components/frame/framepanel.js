class FramePanel extends Jinkela {
  get template() { return `<div><meta ref="content" /></div>`; }
  get styleSheet() {
    return `
      :scope {
        flex: 1;
        overflow: auto;
        height: 100%;
        padding: 0 2em;
        box-sizing: border-box;
      }
    `;
  }
}
