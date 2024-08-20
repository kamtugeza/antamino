/**
 * @typedef {object} LookupResult
 * @property {Record<string, string>} [params]
 * @property {*} value
 */
import ParamNode from './nodes/param'
import StaticNode from './nodes/static'

export default class Antamino {
  #rootNode = new StaticNode()

  /**
   * @param {string} path
   * @param {*} value
   * @returns
   */
  insert(path, value) {
    let index = 0
    let curNode = this.#rootNode
    const paramNames = []

    /* Find the closest node for insertion. */
    while (index < path.length) {
      let childNode = curNode.getChildNode(path.charAt(index))
      if (!childNode) break
      childNode = childNode.fork(curNode, path, index)
      const endOfNode = childNode.getEndOfNode(path, index)
      const paramName = childNode.readParamName(path, index, endOfNode)
      curNode = childNode
      index = endOfNode
      if (paramName) paramNames.push(paramName)
    }

    /* Insert new nodes into the tree. */
    while (index < path.length) {
      const { endOfNode, newNode } = ParamNode.from(path, index) || StaticNode.from(path, index)
      const paramName = newNode.readParamName(path, index, endOfNode)
      curNode.setChildNode(newNode)
      curNode = newNode
      index = endOfNode
      if (paramName) paramNames.push(paramName)
    }

    curNode.value = value
    curNode.paramNames = paramNames

    return this
  }

  /**
   * @param {string} path
   * @returns {LookupResult}
   */
  lookup(path) {
    let index = 0
    let curNode = this.#rootNode
    const paramValues = []

    while (index < path.length) {
      const childNode =
        curNode.getChildNode(path.charAt(index)) ||
        curNode.getChildNode(ParamNode.PATTERN_START_SYMBOL)
      if (!childNode?.matches(path, index)) return undefined
      const endOfNode = childNode.getEndOfNode(path, index)
      const paramValue = childNode.readParamValue(path, index, endOfNode)
      curNode = childNode
      index = endOfNode
      if (paramValue) paramValues.push(paramValue)
    }

    if (index !== path.length) return undefined

    const result = { value: curNode.value }

    if (paramValues.length > 0) {
      result.params = {}
      for (let i = 0, l = paramValues.length; i < l; i++) {
        result.params[curNode.paramAt(i)] = paramValues[i]
      }
    }

    return result
  }

  static from() {
    return new Antamino()
  }
}
