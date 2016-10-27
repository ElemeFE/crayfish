class FormTextField extends TextField {
  init() {
    if ('text' in this) this.element.value = this.text;
    if ('readonly' in this) this.element.setAttribute('readonly', 'readonly');
  }
  get styleSheet() {
    return `
      :scope {
        width: 300px;
        &[readonly] {
          background: #faf5f5;
        }
      }
    `;
  }
}
