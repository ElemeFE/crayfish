addEventListener('DOMContentLoaded', () => {
  let page = new Page({ Content: Default }).renderTo(document.body);
  addEventListener('hashchange', () => page.frame.content.update());
});
