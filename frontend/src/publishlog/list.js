class LogListItemAction extends Jinkela {
  get template() { return `<a href="JavaScript:"></a>`; }
  init() {
    this.element.textContent = this.text;
    this.element.addEventListener('click', this.onClick);
  }
}

class LogListItem extends Jinkela {
  static cast(arr) {
    let result = arr.map(raw => new this(raw));
    result.renderTo = parent => {
      result.forEach(item => item.renderTo(parent));
      return result;
    };
    return result;
  }
  init() {
    this.userName = this.create_by.name;
    this.email = this.create_by.email;
    this.emailLink = 'mailto:' + this.email;
  }
  get isVisible() { return this.$isVisible; }
  set isVisible(value) {
    if (this.$isVisible === value) return;
    this.$isVisible = value;
    this.element.style.display = value ? 'table-row' : 'none';
  }
  get template() {
    return `
      <tr>
        <td>{id}</td>
        <td><span>{userName}</span>（<a href="{emailLink}">{email}</a>）</td>
        <td>{time}</td>
      </tr>
    `;
  }
  get styleSheet() {
    return `
      :scope {
        a {
          color: inherit;
          text-decoration: none;
        }
      }
    `;
  }
}

class LogListHead extends Jinkela {
  get template() {
    return `
      <tr>
        <th>Publish ID</th>
        <th>By</th>
        <th width="156">Time</th>
      </tr>
    `;
  }
}

class LogList extends DataTable {
  async init() {
    let { permissions } = await $user;
    this.canPublish = !!~permissions.indexOf('PUBLISH');
    this.element.setAttribute('can-publish', this.canPublish);
    new LogListHead().renderTo(this.thead);
    this.filters = {};
    this.update();
  }
  async update() {
    let data = await (await fetch('/api/publishlog/' + new UParams().domain, { credentials: 'include' })).json();
    data.forEach(item => {
      item.time = new Date(Date.parse(item.create_at))
        .toLocaleString('zh-CN', { hour12: false })
        .replace(/\//g, '-').replace(/\b\d\b/g, '0$&');
      item.parent = this;
    });
    this.tbody.innerHTML = '';
    this.data = LogListItem.cast(data).renderTo(this.tbody);
    this.applyFilter();
  }
  get styleSheet() {
    return `
      :scope {
        tr > *:nth-child(4) {
          width: 60px;
          text-align: center;
          white-space: nowrap;
          display: none;
        }
        &[can-publish=true] tr > *:nth-child(4) {
          display: table-cell;
        }
      }
    `;
  }
}
