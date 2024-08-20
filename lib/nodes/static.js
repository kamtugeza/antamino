import BasicNode from './basic'
import ParamNode from './param'

export default class StaticNode extends BasicNode {
  fork(parentNode, pattern, position) {
    for (let index = 0; index < this.prefix.length; index++) {
      const isFork = pattern.charAt(position + index) !== this.prefix.charAt(index)
      if (isFork) {
        const newParent = new StaticNode(this.prefix.slice(0, index))
        parentNode.setChildNode(newParent)
        this.prefix = this.prefix.slice(index)
        newParent.setChildNode(this)
        return newParent
      }
    }
    return this
  }

  getEndOfNode(_, position) {
    return position + this.prefix.length
  }

  matches(path, position) {
    const endOfNode = position + this.prefix.length
    return this.prefix === path.slice(position, endOfNode)
  }

  /**
   * @param {string} pattern
   * @param {number} position
   * @returns {import('./basic').NodeCreationOutput}
   */
  static from(pattern, position) {
    const result = Object.create(null)
    const charIndex = pattern.indexOf(ParamNode.PATTERN_START_SYMBOL, position)
    result.endOfNode = charIndex >= 0 ? charIndex : pattern.length
    result.newNode = new StaticNode(pattern.slice(position, result.endOfNode))
    return result
  }
}
