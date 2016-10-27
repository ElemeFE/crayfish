class Button extends Jinkela {
  get template() { return `<button></button>`; }
  init() {
    if (this.class) this.element.setAttribute('class', this.class);
    if (this.text) this.element.setAttribute('text', this.text);
    this.element.addEventListener('click', this.click);
  }
  @autobind async click() {
    if (this.element.classList.contains('busy')) return;
    if (typeof this.onClick !== 'function') return;
    this.element.classList.add('busy');
    try {
      let result = this.onClick();
      if (typeof result.then === 'function') await result;
    } catch (error) {
      console.error(error);
      // Do nothing
    }
    this.element.classList.remove('busy');
  }
  get styleSheet() {
    return `
      :scope {
        box-sizing: border-box;
        display: inline-block;
        border: 1px solid #ddd;
        font-size: 12px;
        line-height: 14px;
        border-radius: 0px;
        padding: 8px 16px;
        background: #f7f7f7;
        outline: none;
        cursor: pointer;
        position: relative;
        &::before {
          content: attr(text);
        }
        &:hover {
          background: #fff;
        }
        &.primary {
          border-color: #cc3400;
          background: #cc3400;
          color: #fff;
        }
        &.primary:hover {
          background: #cc3400;
          opacity: 0.8;
        }
        &::after {
          position: absolute;
          left: 16px;
          right: 16px;
          top: 8px;
          bottom: 8px;
        }
        &.busy.busy {
          &::before {
            visibility: hidden;
          }
          &::after {
            content: '';
            animation: button-busy 1000ms infinite;
          }
          opacity: 0.5;
        }
      }
      @keyframes button-busy {
        0% {
          content: '·';
        }
        25% {
          content: '··';
        }
        50% {
          content: '···';
        }
        75% {
          content: '····';
        }
        100% {
          content: '·';
        }
      }
    `;
  }
}
