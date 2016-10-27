class DomainPanelDatePicker extends Jinkela {
  get template() {
    let starting = new Date().getFullYear() - 8;
    return `<j-datepicker value="{value}" starting="${starting}"></j-datepicker>`;
  }
}
