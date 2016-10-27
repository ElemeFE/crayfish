class DomainPanel extends FormPanel {
  get template() {
    return `
      <table>
        <tr>
          <th>Path</th>
          <td><meta ref="pathField" /></td>
        </tr>
        <tr>
          <th>Name</th>
          <td><meta ref="nameField" /></td>
        </tr>
        <tr>
          <th>Type</th>
          <td><meta ref="typeField" /></td>
        </tr>
        <tr>
          <th>Value</th>
          <td><meta ref="valueField" /></td>
        </tr>
        <tr>
          <th>Comment</th>
          <td><meta ref="commentField" /></td>
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
      path: this.pathField.value,
      name: this.nameField.value,
      value: this.valueField.value,
      type: this.typeField.value,
      comment: this.commentField.value
    };
  }
  @getonce static get typeMap() {
    return {
      2: DomainPanelTextArea,
      3: DomainPanelNumber,
      4: DomainPanelBoolean,
      5: DomainPanelPercent,
      6: DomainPanelDatePicker,
      9: DomainPanelJSON
    };
  }
  @getonce setValueType(type) {
    let { typeMap } = this.constructor;
    this.valueField = new (typeMap[type] || FormTextField)();
  }
}

class DomainPanelWithCreating extends DomainPanel {
  @getonce get title() { return 'Creating'; }
  init() {
    this.pathField = new FormTextField();
    this.nameField = new FormTextField();
    this.commentField = new FormTextField();
    this.typeField = new TypeSelector({ onValueSet: type => this.setValueType(type) });
    this.savingButton = new Button({ text: 'Save', onClick: () => this.onSave(), 'class': 'primary' });
    this.cancelButton = new Button({ text: 'Cancel', onClick: dialog.cancel });
  }
}

class DomainPanelWithEditing extends DomainPanel {
  @getonce get title() { return 'Editing'; }
  init() {
    if (!this.parent) throw new Error('require a parent in edit');
    this.pathField = new FormTextField({ text: this.parent.path, readonly: true });
    this.nameField = new FormTextField({ text: this.parent.name, readonly: true });
    this.commentField = new FormTextField({ text: this.parent.comment });
    this.typeField = new TypeSelector({ value: this.parent.type });
    this.setValueType(this.parent.type);
    this.valueField.value = this.parent.value;
    this.savingButton = new Button({ text: 'Save', onClick: () => this.onSave(), 'class': 'primary' });
    this.cancelButton = new Button({ text: 'Cancel', onClick: dialog.cancel });
  }
}
