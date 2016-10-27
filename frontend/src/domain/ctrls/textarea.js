class DomainPanelTextArea extends TextField {
  get template() { return '<textarea></textarea>'; }
  get styleSheet() {
    return `
      :scope {
        width: 300px;
        min-height: 80px;
      }
    `;
  }
}
