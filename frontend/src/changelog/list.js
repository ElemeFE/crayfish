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
    new LogListItemAction({
      text: 'Reuse',
      onClick: async () => {
        let { id, domain } = new UParams();
        let { value } = this;
        let response = await fetch(`/api/domains/${domain}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value }),
          credentials: 'include'
        });
        if (response.status < 400) {
          this.parent.update();
        } else {
          let error = await response.json();
          alert(error.message);
        }
      }
    }).renderTo(this.actions);
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
        <td>{value}</td>
        <td><span>{userName}</span>（<a href="{emailLink}">{email}</a>）</td>
        <td>{time}</td>
        <td ref="actions"></td>
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
        <th>Value</th>
        <th>By</th>
        <th width="156">Time</th>
        <th>Actions</th>
      </tr>
    `;
  }
}

class LogList extends DataTable {
  init() {
    new LogListHead().renderTo(this.thead);
    this.filters = {};
    this.update();
  }
  async update() {
    let data = await (await fetch('/api/changelog/' + new UParams().id, { credentials: 'include' })).json();
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
        }
      }
    `;
  }
}
