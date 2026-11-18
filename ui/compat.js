if (!Element.prototype.replaceChildren) {
  Element.prototype.replaceChildren = function (...children) {
    this.textContent = '';
    this.append(...children);
  };
}
