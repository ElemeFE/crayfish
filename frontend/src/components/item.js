class Item extends Jinkela {
  static cast(arr, common) {
    if (common) arr = arr.map(item => Object.assign({}, item, common));
    let result = arr.map(raw => new this(raw));
    result.renderTo = parent => {
      result.forEach(item => item.renderTo(parent));
      return result;
    };
    return result;
  }
}
