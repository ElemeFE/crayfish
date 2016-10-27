const getonce = (base, name, desc) => {
  let { get } = desc;
  if (get) {
    desc.get = function() {
      delete desc.get;
      desc.value = get.call(this);
      Object.defineProperty(this, name, desc);
      return desc.value;
    };
  }
};
