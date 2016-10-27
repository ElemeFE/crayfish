class ActionBarCreatingButton extends Button {
  get text() { return 'Create'; }
  get class() { return 'primary'; }
}

class ActionBar extends Jinkela {
  init() {
    new ActionBarCreatingButton({ onClick: this.onClick }).renderTo(this);
  }
  @autobind onClick(event) {
    let { dataTable } = this.parent.parent;
    let { frame } = this.parent.parent.page;
    dialog.popup(new ClientPanelWithCreating({
      async onSave() {
        let { username } = this.value;
        let { domain } = new UParams();
        let response = await fetch(`/api/privilege/${domain}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: username }),
          credentials: 'include'
        });
        if (response.status < 400) {
          dialog.cancel();
          frame.update();
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
      }
    `;
  }
}
