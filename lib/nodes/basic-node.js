export default class BasicNode {
  /**
   * @param {string} prefix - A part of the path associated with the node
   * @param {*} value
   */
  constructor(prefix, value) {
    /** @type {Map<string, BasicNode>} */
    this.children = new Map()
    this.prefix = prefix
    this.value = value
  }

  /**
   * @param {string} char - The first character of the child node prefix.
   * @returns {BasicNode | undefined}
   */
  getChild(char) {
    return this.children.get(char)
  }

  /**
   * @param {BasicNode} node - The child node.
   * @returns {BasicNode} Returns the current node.
   */
  setChild(node) {
    this.children.set(node.prefix.charAt(0), node)
    return this
  }

  /**
   * @param {string} prefix - A part of the path associated with the node.
   * @param {*} value
   * @returns {BasicNode}
   */
  static from(prefix, value) {
    return new BasicNode(prefix, value)
  }
}
