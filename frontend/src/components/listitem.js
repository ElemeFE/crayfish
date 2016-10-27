class ListItem extends Item {

  init() {
    if (this.active) this.element.firstChild.style.background = 'rgba(0,0,0,.1)';
    if (!this.href) this.href = 'JavaScript:';
  }

  get template() { return `<li><a href="{href}" on-click="{onClick}">{text}</a></li>`; }

}
