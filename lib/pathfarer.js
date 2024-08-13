import StaticNode from './nodes/static-node'
import locateTarget from './utils/locate-target'

export default class Pathfarer {
  #rootNode = new StaticNode()

  /**
   * @param {string} path
   * @param {*} value
   * @returns
   */
  insert(path, value) {
    if (path.length === 0) {
      this.#rootNode.value = value
      return this
    }

    let index = 0
    let curNode = this.#rootNode

    /* Find the closest node for insertion. */
    while (index < path.length) {
      const childNode = locateTarget(curNode, path, index)
      if (!childNode) break
      index = childNode.prefix.length
      curNode = childNode
    }

    const isTarget = index === path.length
    if (isTarget) {
      curNode.value = value
      return this
    }
    curNode.setChild(StaticNode.from(path.slice(index), value))
    return this
  }

  /**
   * @param {string} path
   * @returns
   */
  lookup(path) {
    if (path.length === 0) return { value: this.#rootNode.value }

    let index = 0
    let curNode = this.#rootNode

    while (index < path.length) {
      const childNode = curNode.getChild(path.charAt(index))
      if (!childNode) return undefined
      index += childNode.prefix.length
      curNode = childNode
    }

    const isTarget = index === path.length && path.endsWith(curNode.prefix)
    if (isTarget) return { value: curNode.value }
  }

  static from() {
    return new Pathfarer()
  }
}
