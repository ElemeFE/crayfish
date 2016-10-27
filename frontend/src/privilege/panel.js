class ClientPanelUserSearch extends Jinkela {
  init() {
    this.textField = new FormTextField({ onInput: () => this.input() }).renderTo(this);
    this.textField.element.addEventListener('focus', () => this.focus());
    this.textField.element.addEventListener('blur', () => this.blur());
    Object.defineProperty(this.element, 'value', {
      get: () => this.textField.element.value,
      set: value => this.textField.element.value = value
    });
  }
  async input() {
    let { value } = this.element;
    if (!value.length) return this.close();
    let response = await fetch(`/api/searchuser?kw=${encodeURIComponent(value)}`, { credentials: 'include' });
    let result = await response.json();
    let data = result.map(({ name, email }) => ({ text: `${name}（${email}）` }));
    if (data.length) {
      this.ul.innerHTML = '';
      ListItem.cast(data).renderTo(this.ul);
      this.ul.classList.add('active');
    } else {
      this.ul.classList.remove('active');
    }
  }
  async focus() {
    this.input();
  }
  async blur() {
    setTimeout(() => {
      this.ul.classList.remove('active');
    }, 60);
  }
  click(event) {
    let { target } = event;
    if (target.tagName !== 'A') return;
    let mailName = target.textContent.match(/（([^@]*?)@[^@]*?）$|$/)[1];
    this.element.value = mailName;
    this.close();
  }
  close() {
    this.ul.classList.remove('active');
  }
  get template() {
    return `
      <span>
        <ul ref="ul" on-click="{click}"></ul>
      </span>
    `;
  }
  get styleSheet() {
    let tipWidth = 70;
    return `
      :scope {
        position: relative;
        a {
          padding: .25em .5em;
          color: inherit;
          text-decoration: none;
          display: block;
          white-space: nowrap;
        }
        li {
          margin: 0;
          line-height: 1.5;
          transition: background 200ms ease;
          &:hover {
            background: #f0f0f0;
          }
        }
        ul.active { display: block; }
        ul {
          display: none;
          border: 1px solid #dbc6c1;
          padding: 0;
          list-style: none;
          background: #fff;
          position: absolute;
          bottom: 100%;
        }
        input[type=text] {
          width: 200px;
          padding-right: ${tipWidth}px;
        }
        &::after {
          margin-left: -${tipWidth}px;
          width: ${tipWidth}px;
          text-align: center;
          display: inline-block;
          line-height: 32px;
          color: rgba(0, 0, 0, .6);
          font-size: 14px;
          font-weight: bold;
          font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
          vertical-align: top;
          position: relative;
        }
      }
    `;
  }
}

class ClientPanel extends FormPanel {
  get template() {
    return `
      <table>
        <tr>
          <th>User Name</th>
          <td class="slot">
            <meta ref="useridField" />
          </td>
        </tr>
        <tr>
          <th></th>
          <td>
            <meta ref="savingButton" />
            <meta ref="cancelButton" />
          </td>
        </tr>
      </table>
    `;
  }
  get value() {
    return {
      username: this.useridField.value
    };
  }
}

class ClientPanelWithCreating extends ClientPanel {
  @getonce get title() { return 'Creating'; }
  init() {
    this.useridField = new ClientPanelUserSearch();
    this.savingButton = new Button({ text: 'Save', onClick: () => this.onSave(), 'class': 'primary' });
    this.cancelButton = new Button({ text: 'Cancel', onClick: dialog.cancel });
  }
}
