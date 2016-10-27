addEventListener('DOMContentLoaded', () => {
  let page = new Page({ Content: Welcome }).renderTo(document.body);
  addEventListener('hashchange', () => page.frame.content.update());
});
