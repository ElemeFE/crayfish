class FrameMenuItem extends ListItem {
  init() {
    this.$isVisible = true;
    if (this.text === this.domain) this.element.classList.add('active');
    this.element.addEventListener('click', this.click);
  }
  @autobind click(event) {
    let { element } = this;
    let old = element.parentNode.querySelector('.active');
    if (old) old.classList.remove('active');
    element.classList.add('active');
    let params = UParams();
    params.domain = this.text;
    location.hash = params;
  }
  get isVisible() { return this.$isVisible; }
  set isVisible(value) {
    if (this.$isVisible === value) return;
    this.$isVisible = value;
    this.element.style.display = value ? 'block' : 'none';
  }
  get styleSheet() {
    let height = 26;
    return `
      :scope {
        a {
          padding-left: 18px;
          height: ${height}px;
          line-height: ${height}px;
          font-size: 12px;
          display: block;
          text-decoration: none;
          color: inherit;
          border-left: 0 solid #cc3400;
          transition:
            background 200ms ease,
            border-left-width 200ms linear;
          &:hover {
            background: #483B2B;
          }
        }
        &.active a {
          background: #554939;
          border-left-width: 5px;
        }
      }
    `;
  }
}

class FrameMenuList extends Jinkela {
  async init() {
    this.$filter = new RegExp();
    let response = await fetch('/api/domains', { credentials: 'include' });
    let rawList = (await response.json()).map(({ domain: text }) => ({ text }));
    this.list = FrameMenuItem.cast(rawList, { domain: new UParams().domain }).renderTo(this);
    this.filter = this.filter;
  }
  get template() { return '<ul></ul>'; }
  get filter() { return this.$filter; }
  set filter(re) {
    this.$filter = re;
    if (this.list) this.list.forEach(item => item.isVisible = re.test(item.text));
  }
  get styleSheet() {
    return `
      :scope {
        flex: 1;
        overflow: auto;
        padding: 0;
        margin: 0;
        list-style: none;
        font-size: 16px;
      }
    `;
  }
}

class FrameMenuFilter extends Jinkela {
  get template() { return '<div><input placeholder="filter" on-input="{onChange}" /></div>'; }
  get styleSheet() {
    return `
      :scope {
        input {
          border-radius: 5px;
          border: 1px solid rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.1);
          color: #fff;
          padding: 5px;
          outline: none;
          box-sizing: border-box;
          width: 80%;
          margin: 1em 10%;
          &:focus {
            background: rgba(255,255,255,0.2);
          }
        }
      }
    `;
  }
}

class FrameMenu extends Jinkela {
  @autobind onFilterChange({ target }) {
    try {
      this.frameMenuList.filter = new RegExp(target.value);
    } catch (error) {
      this.frameMenuList.filter = new RegExp();
    }
  }
  async init() {
    this.frameMenuFilter = new FrameMenuFilter({ onChange: this.onFilterChange }).renderTo(this);
    this.frameMenuList = new FrameMenuList().renderTo(this);
  }
  get template() { return '<div></div>'; }
  get styleSheet() {
    return `
      :scope {
        width: 180px;
        display: flex;
        flex-direction: column;
        background: #383129;
        overflow: hidden;
        height: 100%;
        color: #fff;
        a {
          text-decoration: none;
          color: inherit;
        }
      }
    `;
  }
}
