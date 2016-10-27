class ClientListItem extends Jinkela {
  static cast(arr) {
    let result = arr.map(raw => new this(raw));
    result.renderTo = parent => {
      result.forEach(item => item.renderTo(parent));
      return result;
    };
    return result;
  }
  init() {
    this.privilegeLink = `/privilege/#domain=${this.domain}`;
    this.publishlogLink = `/publishlog/#domain=${this.domain}`;
  }
  @autobind onRemove() {
    let { domain, parent } = this;
    dialog.popup(new ConfirmPanel({
      text: 'Are you sure to REMOVE this record?',
      async onYes() {
        let response = await fetch(`/api/domains/${domain}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.status < 400) {
          dialog.cancel();
          parent.parent.page.frame.update();
        } else {
          let error = await response.json();
          alert(error.message);
        }
      }
    }, { parent: this }));
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
        <td>{domain}</td>
        <td>
          <a href="{privilegeLink}" target="_blank">Privilege</a>
          <a href="{publishlogLink}" target="_blank">Publish Log</a>
        </td>
        <td>{time}</td>
        <td>
          <a href="JavaScript:" on-click="{onRemove}">Remove</a>
        </td>
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

class ClientListHead extends Jinkela {
  get template() {
    return `
      <tr>
        <th>Domain</th>
        <th>Links</th>
        <th width="156">Time</th>
        <th width="100">Action</th>
      </tr>
    `;
  }
}

class ClientList extends DataTable {
  init() {
    new ClientListHead().renderTo(this.thead);
    this.filters = {};
    this.update();
  }
  async update() {
    let data = await (await fetch('/api/domains', { credentials: 'include' })).json();
    data.forEach(item => {
      item.time = new Date(Date.parse(item.create_at))
        .toLocaleString('zh-CN', { hour12: false })
        .replace(/\//g, '-').replace(/\b\d\b/g, '0$&');
      item.parent = this;
    });
    this.tbody.innerHTML = '';
    this.data = ClientListItem.cast(data).renderTo(this.tbody);
    this.applyFilter();
  }
}
