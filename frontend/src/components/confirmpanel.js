class ConfirmPanel extends Jinkela {
  init() {
    this.title = this.title || 'Confirm';
    this.text = this.text || 'Are you sure?';
    this.yesButton = new Button({ text: 'Yes', onClick: () => this.onYes(), 'class': 'primary' });
    this.cancelButton = new Button({ text: 'Cancel', onClick: dialog.cancel });
  }
  get template() {
    return `
      <div>
        <h3>{text}</h3>
        <div>
          <meta ref="yesButton" />
          <meta ref="cancelButton" />
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
