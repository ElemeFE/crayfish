class ActionBarCreatingButton extends Button {
  get text() { return 'Create'; }
  get class() { return 'primary'; }
}

class ActionBarPublishingButton extends Button {
  get text() { return 'Publish'; }
  get class() { return 'primary'; }
}

class ActionBarCheckbox extends Item {
  get template() {
    return `
      <label>
        <span>{text}</span>
        <input type="checkbox" on-change="{onChange}" />
      </label>
    `;
  }
  get styleSheet() {
    return `
      :scope {
        margin-left: 1em;
      }
    `;
  }
}

class ActionBar extends Jinkela {
  async init() {
    ActionBarCheckbox.cast([
      { text: 'Detail', onChange: ({ target }) => this.dataTable.isShowDetail = target.checked },
      { text: 'Comment', onChange: ({ target }) => this.dataTable.isShowComment = target.checked }
    ]).renderTo(this);
    let { permissions } = await $user;
    if (~permissions.indexOf('PUBLISH')) {
      new ActionBarPublishingButton({ onClick: this.publish }).renderTo(this);
    }
    if (~permissions.indexOf('CHANGE')) {
      new ActionBarCreatingButton({ onClick: this.create }).renderTo(this);
    }
  }
  @autobind publish(event) {
    let { dataTable } = this;
    dialog.popup(new PublishingPanel({ dataTable }));
  }
  @autobind create(event) {
    let { dataTable } = this.parent.parent;
    dialog.popup(new DomainPanelWithCreating({
      async onSave() {
        let { domain } = new UParams();
        let form;
        try {
          form = this.value;
        } catch (error) {
          return alert(error.message);
        }
        let { path, name, value, comment, type } = form;
        let response = await fetch('/api/domains/' + domain, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, name, value, comment, type }),
          credentials: 'include'
        });
        if (response.status < 400) {
          dialog.cancel();
          dataTable.update();
        } else {
          let error = await response.json();
          alert(error.message);
        }
      }
    }));
  }
  get styleSheet() {
    return `
      :scope {
        float: right;
        button {
          margin-left: 1em;
        }
      }
    `;
  }
}
