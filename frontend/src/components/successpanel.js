class SuccessPanel extends Jinkela {
  static popup(...args) { dialog.popup(new this(...args)); }
  init() {
    this.title = this.title || 'Success';
    this.text = this.text || 'Success';
    this.btn = new Button({ text: 'OK', onClick: dialog.cancel, 'class': 'primary' });
  }
  get template() {
    return `
      <div>
        <h3>{text}</h3>
        <div>
          <meta ref="btn" />
        </div>
      </div>
    `;
  }
  get styleSheet() {
    return `
      :scope {
        h3 {
          margin: 0 0 2em 0;
        }
        button {
          margin: 0 1em;
          color: inherit;
        }
        padding: 2em;
      }
    `;
  }
}
