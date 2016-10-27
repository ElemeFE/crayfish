class TypeSelectorItem extends ListItem {
  get template() { return `<option></option>`; }
  init() {
    this.element.textContent = this.text;
    this.element.value = this.value;
  }
}

class TypeSelectorList extends Jinkela {
  get template() { return `<select on-change="{onChange}"></select>`; }
  init() {
    TypeSelectorItem.cast(this.data).renderTo(this);
  }
}

class TypeSelector extends Jinkela {
  @getonce get data() {
    return [
      { text: 'String', value: 1 },
      { text: 'Text', value: 2 },
      { text: 'Number', value: 3 },
      { text: 'Boolean', value: 4 },
      { text: 'Percent', value: 5 },
      { text: 'Date', value: 6 },
      { text: 'JSON', value: 9 }
    ];
  }
  set value(value) {
    this.$value = value;
    if (typeof this.onValueSet === 'function') this.onValueSet(value);
  }
  get value() {
    return this.$value;
  }
  init() {
    Object.defineProperty(this.element, 'value', {
      get: () => this.value,
      set: value => this.value = value
    });
    if (this.value) {
      this.data.some(item => {
        if (item.value === this.value) {
          this.element.textContent = item.text;
          return true;
        }
      });
    } else {
      new TypeSelectorList({
        data: this.data,
        onChange: ({ target }) => {
          this.value = +target.value;
        }
      }).renderTo(this);      
      this.value = this.data[0].value;
    }
  }
}
