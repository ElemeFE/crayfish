class Page extends Jinkela {
  async init() {
    let arg = { page: this };
    new Header(arg).renderTo(this);
    this.frame = new Frame(arg).renderTo(this);
  }
  get styleSheet() {
    return `
      html, body { height: 100%; margin: 0; }
      :scope {
        font-family: 'Helvetica Neue', 'Luxi Sans', 'DejaVu Sans', Tahoma,
                     'Hiragino Sans GB', STHeiti, 'Microsoft YaHei';
      }
    `;
  }
}
