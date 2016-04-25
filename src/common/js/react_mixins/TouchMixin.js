var TouchMixin = {
  touched: false,
  handleTouch: function(fn, e) {
    this.touched = true;
    typeof fn === 'string' ? this[fn](e) : fn.call(this, e);
  },
  handleClick: function(fn, e) {
    if (this.touched) return this.touched = false;
    typeof fn === 'string' ? this[fn](e) : fn.call(this, e);
  }
};
