class DomainPanelPercentBlood extends Jinkela {
  get value() {
    return this.$value;
  }
  set value(value) {
    this.$value = value;
    this.element.style.width = value * 100 + '%';
  }
  get styleSheet() {
    return `
      :scope {
        height: 100%;
        background: #cc3400;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          right: -6px;
          left: calc(100% - 6px);
          top: -3px;
          bottom: -3px;
          border: 2px solid #cc3400;
          border-radius: 100%;
          background: #fff;
        }
      }
    `;
  }
}

class DomainPanelPercentTube extends Jinkela {
  get value() { return +Number(this.blood.value).toFixed(4); }
  set value(value) {
    if (/%$/.test(value)) value = parseFloat(value) / 100;
    this.blood.value = value;
  }
  @autobind mouseup(event) {
    document.body.removeEventListener('mousemove', this.mousemove);
    document.body.removeEventListener('mouseup', this.mouseup);
    this.mousemove(event);
    // Unlock dialog
    setTimeout(() => dialog.dontCancel = false);
    document.body.style.WebkitUserSelect = '';
  }
  @autobind mousemove(event) {
    let { left } = this.element.getBoundingClientRect();
    this.value = Math.min(Math.max(event.clientX - left, 0), this.width) / this.width;
    if (typeof this.onChange === 'function') this.onChange();
  }
  @autobind mousedown(event) {
    document.body.addEventListener('mousemove', this.mousemove);
    document.body.addEventListener('mouseup', this.mouseup);
    this.mousemove(event);
    // Lock dialog
    dialog.dontCancel = true;
    document.body.style.WebkitUserSelect = 'none';
  }
  init() {
    Object.defineProperty(this.element, 'value', {
      get: () => this.value,
      set: value => this.value = value
    });
    this.element.addEventListener('mousedown', this.mousedown);
    this.blood = new DomainPanelPercentBlood().renderTo(this);
    this.value = Number(this.value) || 0;
  }
  get width() { return 300 - 80; /* The 80 is width of TextField */ }
  get styleSheet() {
    let height = 6;
    return `
      :scope {
        vertical-align: middle;
        width: ${this.width}px;
        display: inline-block;
        height: ${height}px;
        line-height: ${height}px;
        text-align: center;
        font-size: 12px;
        color: #fff;
        background: #ccc;
        cursor: pointer;
        position: relative;
      }
    `;
  }
}

class DomainPanelPercentText extends TextField {
  get min() { return 0; }
  get max() { return 100; }
  get type() { return 'number'; }
  get styleSheet() {
    return `
      :scope {
        vertical-align: middle;
        margin-right: 16px;
        width: 64px;
      }
    `;
  }
}

class DomainPanelPercent extends Jinkela {
  init() {

    let input = new DomainPanelPercentText({
      onInput() {
        if (this.element.value > 100) this.element.value = 100;
        if (this.element.value < 0) this.element.value = 0;
        tube.element.value = this.element.value / 100;
      }
    }).renderTo(this);

    let tube = new DomainPanelPercentTube({
      onChange() { input.element.value = (this.element.value * 100).toFixed(2); }
    }).renderTo(this);

    Object.defineProperty(this.element, 'value', {
      get: () => tube.element.value,
      set: value => {
        tube.element.value = value;
        input.element.value = (value * 100).toFixed(2);
      }
    });

  }
  get styleSheet() {
    return `
      :scope {
        white-space: nowrap;
      }
    `;
  }
}
