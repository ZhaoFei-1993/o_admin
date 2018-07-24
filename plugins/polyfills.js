Date.prototype.backendStamp = function () {
  return Math.floor(this.getTime() / 1000)
}