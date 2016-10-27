class ClientListItemAction extends Jinkela {
  get template() { return `<a href="JavaScript:"></a>`; }
  init() {
    this.element.textContent = this.text;
    this.element.addEventListener('click', this.onClick);
  }
  get styleSheet() {
    return `
      a:scope {
        border: 1px solid rgb(225, 149, 123);
        color: rgb(225, 149, 123);
        padding: 2px 4px;
        background: #fff;
        &:hover {
          border-color: #cc3400;
          background: #cc3400;
          color: #fff;
        }
      }
    `;
  }
} 

class ClientListItem extends Item {
  init() {
    switch (this.type) {
      case 5:
        this.valueView = (this.value * 100).toFixed(2) + '%';
        break;
      case 6:
        this.valueView = new Date(this.value).toLocaleDateString('zh-CN').replace(/\//g, '-').replace(/\b\d\b/g, '0$&');
        break;
      case 9:
        this.valueView = JSON.stringify(this.value);
        break;
      default:
        this.valueView = this.value;
    }
    this.pathLink = `/crayfish/${this.domain}${this.path}.crayfish`;
    if (this.canEdit) new ClientListItemAction({ text: 'Edit', onClick: this.edit }).renderTo(this.actions);
    if (this.canChange) new ClientListItemAction({ text: 'Remove', onClick: this.remove }).renderTo(this.actions);
    new ClientListItemAction({ text: 'History', onClick: this.viewHistory }).renderTo(this.actions);
    this.isUnpublished = this.update_at > this.publish_at;
  }
  @autobind viewHistory() {
    open(`/changelog/#id=${this.id}&domain=${this.domain}`);
  }
  @autobind remove() {
    let { id, parent } = this;
    dialog.popup(new ConfirmPanel({
      text: 'Are you sure to REMOVE this record?',
      async onYes() {
        let { domain } = new UParams();
        let response = await fetch(`/api/domains/${domain}/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.status < 400) {
          dialog.cancel();
          parent.update();
        } else {
          let error = await response.json();
          alert(error.message);
        }
      }
    }, { parent: this }));
  }
  @autobind edit() {
    let { id, parent } = this;
    dialog.popup(new DomainPanelWithEditing({
      async onSave() {
        let form;
        try {
          form = this.value;
        } catch (error) {
          return alert(error.message);
        }
        let { value, comment } = form;
        let { domain } = new UParams();
        let response = await fetch(`/api/domains/${domain}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value, comment }),
          credentials: 'include'
        });
        if (response.status < 400) {
          dialog.cancel();
          parent.update();
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
  get isUnpublished() { return this.$isUnpublished; }
  set isUnpublished(value) {
    if (this.$isUnpublished === value) return;
    if ((this.$isUnpublished = value)) {
      this.element.setAttribute('unpublished', '');
    } else {
      this.element.removeAttribute('unpublished');
    }
  }
  get template() {
    return `
      <tr>
        <td><a href="{pathLink}" target="_blank">{path}</a></td>
        <td>{name}</td>
        <td>
          <span class="unpublished-badge"></span>
          <span>{valueView}</span>
        </td>
        <td>{comment}</td>
        <td ref="actions"></td>
      </tr>
    `;
  }
  get styleSheet() {
    return `
      :scope {
        &.weak-top td {
          border-top-color: #fbf6f1;
          border-top-style: dashed;
        }
        &.weak-bottom td {
          border-bottom-color: #f8f3ee;
          border-bottom-style: dashed;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        [ref="actions"] a + a {
          margin-left: 1em;
        }
        &[unpublished] {
          .unpublished-badge:after {
            margin-right: 4px;
            color: rgb(225, 149, 123);
            content: 'UPDATED';
          }
        }
      }
    `;
  }
}

class ClientListHead extends Jinkela {
  get template() {
    return `
      <tr>
        <th>Path</th>
        <th>Name</th>
        <th>Value</th>
        <th>Comment</th>
        <th width="1">Action</th>
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
    let { domain } = new UParams();
    let data = await (await fetch('/api/domains/' + domain, { credentials: 'include' })).json();
    let { permissions } = await $user;
    let canChange = ~permissions.indexOf('CHANGE');
    let canEdit = ~permissions.indexOf('EDIT');
    data.forEach(item => {
      item.parent = this;
      item.domain = domain;
      item.canChange = canChange;
      item.canEdit = canEdit;
    });
    this.tbody.innerHTML = '';
    this.data = ClientListItem.cast(data).renderTo(this.tbody);
    if (this.data.length) this.data.reduce((last, item) => {
      if (last.path === item.path) {
        last.element.classList.add('weak-bottom');
        item.element.classList.add('weak-top');
      }
      return item;
    });
    this.applyFilter();
  }
  set isShowComment(state) {
    if (state) {
      this.element.setAttribute('show-comment', '');
    } else {
      this.element.removeAttribute('show-comment');
    }
  }
  set isShowDetail(state) {
    if (state) {
      this.element.setAttribute('show-detail', '');
    } else {
      this.element.removeAttribute('show-detail');
    }
  }
  get styleSheet() {
    return `
      :scope {
        tr > *:nth-child(5) {
          text-align: right;
          white-space: nowrap;
        }
        &:not([show-detail]) {
          td {
            max-width: 500px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        &:not([show-comment]) {
          tr > *:nth-child(4) {
            display: none;
          }
        }
      }
    `;
  }
}
