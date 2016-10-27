class ClientPanel extends FormPanel {
  get template() {
    return `
      <table>
        <tr>
          <th>Domain</th>
          <td><meta ref="domainField" /></td>
        </tr>
        <tr>
          <th></th>
          <td>
            <meta ref="savingButton" />
            <meta ref="cancelButton" />
          </td>
        </tr>
      </table>
    `;
  }
  get value() {
    return {
      domain: this.domainField.value
    };
  }
}

class ClientPanelWithCreating extends ClientPanel {
  @getonce get title() { return 'Creating'; }
  init() {
    this.domainField = new FormTextField();
    this.savingButton = new Button({ text: 'Save', onClick: () => this.onSave(), 'class': 'primary' });
    this.cancelButton = new Button({ text: 'Cancel', onClick: dialog.cancel });
  }
}
