import BasicNode from './basic-node'

export default class StaticNode extends BasicNode {
  /**
   * Splits the current node into two separate nodes at the specified position:
   *
   * - Left Node: A new node containing the original node’s prefix portion from the start till the
   * specified position. This new node replaces the current node in the parent node’s children list.
   * - Right Node: The original node, now containing the remaining portion of its prefix starting
   * from the specified position, is attached as a child of the left node.
   *
   * @param {StaticNode} parentNode - The parent node that currently contains this node as a child.
   * @param {number} position - the position in the prefix at which to split the node.
   * @returns {StaticNode} Returns the new node.
   */
  fork(parentNode, position) {
    const newParent = StaticNode.from(this.prefix.slice(0, position))
    parentNode.setChild(newParent)
    this.prefix = this.prefix.slice(position)
    newParent.setChild(this)
    return newParent
  }

  /**
   * @param {string} prefix - A part of the path associated with the node
   * @param {*} value
   * @returns {StaticNode}
   */
  static from(prefix, value) {
    return new StaticNode(prefix, value)
  }
}
