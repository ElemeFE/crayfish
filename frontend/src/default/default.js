class Default extends Jinkela {
  init() {
    this.referrer = function () {
      let parser = document.createElement('a');
      parser.href = document.referrer;
      let { host, pathname } = parser;
      if (host === location.host && pathname !== '/default/') {
        return pathname;
      }
      return '/domain/';
    }();
    this.update();
  }
  update() {
    let { domain } = new UParams();
    if (domain && location.pathname === '/default/') {
      location.pathname = this.referrer;
    } else {
      this.element.innerHTML = typeof crayfish !== 'undefined' && crayfish.default || '<h1>Crayfish</h1>';
    }
  }
  get styleSheet() {
    return `
      :scope {
        margin: 2em 0;
        line-height: initial;
      }
    `;
  }
}
