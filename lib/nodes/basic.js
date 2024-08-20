/**
 * @typedef NodeCreationOutput
 * @property {number} endOfNode
 * @property {BasicNode} newNode
 */

/**
 * The Basic Node is not designed to be constructed as a standalone node; it holds common logic for
 * inherited node types (e.g., StaticNode or ParamNode).
 *
 * @abstract
 */
export default class BasicNode {
  /**
   * @param {string} prefix - A part of the path associated with the node
   * @param {*} value
   */
  constructor(prefix, value) {
    /** @type {Map<string, BasicNode>} */
    this.children = new Map()

    /** @type {string[] | null} A list of param names associated with the route. */
    this.paramNames = null
    this.prefix = prefix
    this.value = value
  }

  /**
   * Splits the current node into two distinct nodes at the position where the node's prefix
   * diverges from the path, starting from the specified position:
   *
   * - Left Node: A new node containing the portion of the original child node’s prefix that
   * matches the path starting from the specified position. This new node replaces the original
   * child node in the current node’s children list.
   * - Right Node: The original child node, now containing the remaining portion of its prefix that
   * does not match the path from the specified position, is attached as a child of the left node.
   *
   * @param {BasicNode} parentNode
   * @param {string} pattern
   * @param {number} position
   * @returns {BasicNode}
   */
  fork(parentNode, pattern, position) {
    return this
  }

  /**
   * @param {string} char - The first character of the child node prefix.
   * @returns {BasicNode | undefined}
   */
  getChildNode(char) {
    return this.children.get(char)
  }

  /**
   * @param {string} path
   * @param {number} position
   * @returns {number}
   */
  getEndOfNode(path, position) {
    throw new Error('Method `getEndOfNode` is not implemented.')
  }

  /**
   * Compare the node to the part of the path during the lookup process.
   *
   * @param {string} path - The entire path that is being evaluated.
   * @param {number} position - The current position in the path to compare against the node.
   * @returns {boolean} Returns `true` if the node matches the part of the path at the given
   * position; otherwise, it returns `false`.
   */
  matches(path, position) {
    return true
  }

  /**
   * @param {number} position
   * @returns {string | undefined}
   */
  paramAt(position) {
    return this.paramNames?.[position]
  }

  /**
   * @param {string} path
   * @param {number} from
   * @param {number} to
   * @returns {string | undefined}
   */
  readParamName(path, from, to) {
    return undefined
  }

  /**
   * @param {string} path
   * @param {number} from
   * @param {number} to
   * @returns {string | undefined}
   */
  readParamValue(path, from, to) {
    return undefined
  }

  /**
   * @param {BasicNode} node - The child node.
   * @returns {BasicNode} Returns the current node.
   */
  setChildNode(node) {
    this.children.set(node.prefix.charAt(0), node)
    return this
  }
}
