class Frame extends Jinkela {
  init() {
    this.update();
  }
  update() {
    this.element.innerHTML = '';
    this.menu = new FrameMenu().renderTo(this);
    let { Content } = this.page;
    let content = this.content = new Content({ page: this.page });
    this.panel = new FramePanel({ content }).renderTo(this);
  }
  set content(value) {
    this.$content = value;
    if (this.panel) this.panel.content = this.content;
  }
  get content() { return this.$content || new Jinkela(); }
  get styleSheet() {
    return `
      :scope {
        height: calc(100vh - 50px);
        display: flex;
        font-size: 12px;
        line-height: 14px;
        color: #484848;
        min-height: 400px;
        overflow: hidden;
        box-sizing: border-box;
      }
    `;
  }
}
