class DomainPanelJSON extends Jinkela {
  init() {
    let textarea = new DomainPanelTextArea().renderTo(this).element;
    Object.defineProperty(this.element, 'value', {
      get: () => {
        try {
          return JSON.parse(textarea.value);
        } catch (error) {
          throw new Error('数据必须是一个 JSON');
        }
      },
      set: value => textarea.value = JSON.stringify(value, null, 2)
    });
  }
  get styleSheet() {
    return `
      :scope {
        font-family: monospace;
      }
    `;
  }
}
