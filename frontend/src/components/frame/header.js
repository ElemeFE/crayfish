class HeaderLogo extends Jinkela {
  init() {
    if (location.pathname === '/') this.element.firstElementChild.style.background = 'rgba(0,0,0,0.1)';
  }
  get template() {
    return `
      <div>
        <a href="/">
          <svg x="0" y="0" viewBox="0 0 96 96">
            <path d="M55,4c2-6-44,18-40,48 c3,24,21,21,26,20c5-1,14-12,14-12s-19-2-19-17 S53,10,55,4z" />
            <path d="M44,50c0,0,8-5,10-10 c2-4,2-17,2-17s10,3,8,14c-1,11-5,18-7,19 C54,58,44,50,44,50z" />
            <path d="M37,81C52,79,58,70,61,65 c2,1,4,4,8,6c3,1,6,2,7,3c-3,5-10,8-13,10 C56,89,34,81,37,81z" />
          </svg>
        </a>
      </div>
    `;
  }
  get styleSheet() {
    return `
      :scope {
        display: inline-block;
        svg {
          fill: #fff;
          display: block;
          width: 40px;
          height: 40px;
        }
        a {
          display: inline-block;
          vertical-align: top;
          padding: 5px;
        }
      }
    `;
  }
}

class HeaderName extends Jinkela {
  get template() { return `<a href="/">Crayfish 2.0</a>`; }
  get styleSheet() {
    return `
      :scope {
        display: inline-block;
        vertical-align: top;
        fill: #fff;
        width: 130px;
        text-align: center;
        font-size: 14px;
        margin: 0;
        text-decoration: none;
        color: inherit;
        &:hover {
          opacity: .8;
        }
      }
    `;
  }
}

class HeaderNavItem extends ListItem {
  get active() { return location.pathname === this.path; }
  onClick() {
    location.pathname = this.path;
  }
  get styleSheet() {
    return `
      :scope {
        display: inline-block;
        > a {
          color: inherit;
          text-decoration: none;
          display: inline-block;
          padding: 0 2em;
          &:hover {
            opacity: .8;
          }
        }
      }
    `;
  }
}

class HeaderNav extends Jinkela {
  init() {
    let { permissions } = this.user;
    new HeaderNavItem({ text: 'Data', path: '/domain/' }).renderTo(this);
    new HeaderNavItem({ text: 'Publish Log', path: '/publishlog/' }).renderTo(this);
    if (~permissions.indexOf('ADMIN')) {
      new HeaderNavItem({ text: 'Privilege', path: '/privilege/' }).renderTo(this);
      new HeaderNavItem({ text: 'Domains', path: '/domains/' }).renderTo(this);
    }
  }
  get template() { return `<ul></ul>`; }
  get styleSheet() {
    return `
      :scope {
        display: inline-block;
        vertical-align: top;
        fill: #fff;
        font-size: 14px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
    `;
  }
}

class HeaderAside extends Jinkela {
  async init() {
    this.name = this.user.name;
    this.SSOURL = $user.SSOURL;
  }
  get template() {
    return `
      <div>
        <a href="{SSOURL}" title="返回 SSO">{name}</a>
      </div>
    `;
  }
  get styleSheet() {
    return `
      :scope {
        margin-right: 2em;
        float: right;
        font-size: 12px;
        a {
          color: inherit;
          text-decoration: none;
          margin-left: 2em;
          &:hover {
            opacity: .8;
          }
        }
      }
    `;
  }
}

class Header extends Jinkela {
  async init() {
    let user = await $user;
    new HeaderLogo().renderTo(this);
    new HeaderName().renderTo(this);
    new HeaderNav({ user }).renderTo(this);
    new HeaderAside({ user }).renderTo(this);
  }
  get styleSheet() {
    return `
      :scope {
        height: 50px;
        line-height: 50px;
        background: #cc3400;
        color: #fff;
      }
    `;
  }
}
