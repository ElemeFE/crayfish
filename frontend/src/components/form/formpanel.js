class FormPanel extends Jinkela {
  init() {
    this.element.addEventListener('keyup', this.keyup);
  }
  @autobind keyup({ keyCode, target }) {
    if (keyCode !== 13) return;
    if (target.tagName === 'TEXTAREA') return;
    if (typeof this.onSave === 'function') this.onSave();
  }
  get styleSheet() {
    return `
      :scope {
        font-size: 12px;
        margin: 0 auto;
        padding: 1em;
        th, td {
          padding: .5em;
        }
        th {
          font-weight: normal;
          text-align: right;
        }
        td {
          text-align: left;
        }
        button {
          margin-right: 1em;
        }
      }
    `;
  }
}
