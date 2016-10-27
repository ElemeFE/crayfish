class Container extends Jinkela {
  get styleSheet() {
    return `
      j-container:scope,
      :scope j-container {
        display: block;
        width: 990px;
        margin: auto;
      }
    `;
  }
}
