addEventListener('DOMContentLoaded', () => {
  let page = new Page({ Content: Main }).renderTo(document.body);
  addEventListener('hashchange', () => page.frame.content.update());
});
