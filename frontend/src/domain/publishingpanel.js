class PublishingPanelPath extends Item {
  init() {
    let { publishAt, updateAt } = this;
    this.checked = publishAt < updateAt;
    this.title = `updateAt: ${updateAt}\npublishAt: ${publishAt}`;
  }
  get checked() { return this.checkbox.checked; }
  set checked(value) {
    this.checkbox.checked = value;
    this.change();
  }
  change() {
    this.element.setAttribute('checked', !!this.checked);
  }
  get template() {
    return `
      <label title="{title}">
        <input type="checkbox" ref="checkbox" on-change="{change}" />
        <span>{path}</span>
      </label>
    `;
  }
  get styleSheet() {
    return `
      :scope {
        display: inline-block;
        border: 1px solid #eee;
        background: #fafafa;
        padding: 3px 6px;
        margin: .5em;
        cursor: pointer;
        vertical-align: top;
        &[checked=true] {
          padding: 2px 5px;
          border-width: 2px;
          border-color: #cc3400;
          color: #cc3400;
        }
        > input { display: none; }
      }
    `;
  }
}

class PublishingPanelPathList extends Jinkela {
  init() {
    this.list = PublishingPanelPath.cast(this.squashedList).renderTo(this);
  }
  get value() {
    return this.list.filter(item => item.checked).map(item => item.path);
  }
  get styleSheet() {
    return `
      :scope {
        font-size: 12px;
        font-family: Monospace;
        text-align: left;
        margin-bottom: 2em;
        padding-bottom: 2em;
        border-bottom: 1px solid #ebe6e1;
      }
    `;
  }
}

class PublishingPanelButtons extends Jinkela {
  init() {
    this.yesButton = new Button({ text: 'Publish', onClick: () => this.publish(), 'class': 'primary' }).renderTo(this);
    this.cancelButton = new Button({ text: 'Cancel', onClick: dialog.cancel }).renderTo(this);
  }
  get styleSheet() {
    return `
      :scope {
        font-size: 12px;
        margin: 2em;
      }
    `;
  }
  async publish() {
    if (this.publishing) return this.publishing;
    this.publishing = fetch(`/api/cdn/${this.domain}/publish`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.parent.list.value)
    });
    let response = await this.publishing;
    if (response.status < 400) {
      SuccessPanel.popup({ text: 'Published Successfully' });
      this.dataTable.update();
    } else {
      let error = await response.json();
      ErrorPanel.popup({ text: error.message });
    }
    this.publishing = null;
  }
}

class PublishingPanel extends Jinkela {

  async init() {
    this.title = 'Confirm to PUBLISH';
    this.domain = new UParams().domain;
    let squashedListResponse = await fetch(`/api/squash/${this.domain}`, { credentials: 'include' });
    let squashedList = await squashedListResponse.json();
    this.list = new PublishingPanelPathList({ squashedList }).renderTo(this);
    new PublishingPanelButtons(this).renderTo(this);
  }

  get styleSheet() {
    return `
      :scope {
        h3 {
          margin: 0 0 2em 0;
        }
        button {
          margin: 0 1em;
          color: inherit;
        }
        padding: 2em;
      }
    `;
  }

}
