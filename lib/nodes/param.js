import BasicNode from './basic'

export default class ParamNode extends BasicNode {
  constructor(value) {
    super(ParamNode.PATTERN_START_SYMBOL, value)
  }

  getEndOfNode(path, position) {
    const endOfNode = path.indexOf(ParamNode.PATTERN_END_SYMBOL, position)
    const skipToPathEnd = endOfNode < 0
    /**
     * If the parameterized node ends before the end of the path, the index is shifted one
     * character forward to skip the node's end (e.g., `/`).
     */
    return skipToPathEnd ? path.length : endOfNode + 1
  }

  readParamName(path, from, to) {
    if (path.charAt(from) !== ParamNode.PATTERN_START_SYMBOL) return undefined
    const endOfNode = path.length === to ? to : to - 1
    return path.slice(from + 1, endOfNode)
  }

  readParamValue(path, from, to) {
    const endOfNode = path.length === to ? to : to - 1
    return path.slice(from, endOfNode)
  }

  /**
   * @param {string} pattern
   * @param {number} position
   * @returns {import('./basic').NodeCreationOutput | null}
   */
  static from(pattern, position) {
    if (pattern.charAt(position) !== ParamNode.PATTERN_START_SYMBOL) return undefined
    const result = Object.create(null)
    const newNode = new ParamNode()
    result.endOfNode = newNode.getEndOfNode(pattern, position)
    result.newNode = newNode
    return result
  }

  static PATTERN_END_SYMBOL = '/'
  static PATTERN_START_SYMBOL = ':'
}
