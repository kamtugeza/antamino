/**
 * @typedef {object} LookupResult
 * @property {Record<string, string>} [params] - An object where the keys are dynamic parameter
 * names of the route, and the values are the corresponding values extracted from the path.
 * @property {*} value - The value associated with the matched route.
 */

const ParamNode = require('./nodes/param')
const StaticNode = require('./nodes/static')

/**
 * The `Antamino` library is lightweight, zero-dependency routing built on the Radix Tree.
 * It supports static and dynamic (denoted by `:`) segments in the path.
 *
 * @example
 * const routing = Antamino.from()
 *   .insert('GET/blog/:article', renderArticle)
 *
 * http.createServer((req, res) => {
 *   const { params, value } = routing.lookup(req.method + req.url)
 *   const body = value(params)
 *   res.writeHead(200).end(body)
 * }).listen(80)
 */
class Antamino {
  #rootNode = new StaticNode()

  /**
   * The `insert` method registers a new route and its associated value (e.g., function, object,
   * primitive value, etc.) in the routing tree built on the Radix Tree.
   *
   * The route path contains both static and dynamic (denoted by `:`) segments. The dynamic
   * segments are used during the lookup process to gather values from the path.
   *
   * @param {string} pathAndParams - The route path to register into the router tree.
   * @param {*} value - The value to associate with the route.
   * @returns {this} Returns the instance of the routing object to allow for method chaining.
   *
   * @example
   * const routing = new Antamino()
   *   .insert('read/', renderHome)
   *   .insert('read/blog', renderBlog)
   *   .insert('read/blog/:article', renderArticle)
   *   .insert('create/blog/:article'. saveArticle)
   */
  insert(pathAndParams, value) {
    const [path] = pathAndParams.split('?')
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
   * The `lookup` method traverses the routing tree to find the node that matches the provided
   * path. If a match is found, it returns an object containing the associated value and any
   * dynamic parameters extracted from the path; otherwise, it returns `undefined`.
   *
   * @param {string} pathAndParams - The path to finding the associated route.
   * @returns {LookupResult} The searching if the route exists; otherwise, it returns `undefined`.
   *
   * @example
   * const routing = new Antamino().insert('read/blog/:article', renderArticle)
   * routing.lookup('read/blog/htmx') // { params: { aritlce: 'htmx' }, value: renderArticle }
   * routing.lookup('read/contacts')  // undefined
   */
  lookup(pathAndParams) {
    const [path] = pathAndParams.split('?')
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

  /**
   * Creates a new instance of the Antamino class.
   *
   * @returns {Antamino} - A new instance of the `Antamino` class.
   *
   * @example
   * const routing = Antamino.from().insert('read/blog/:article', renderArticle)
   */
  static from() {
    return new Antamino()
  }
}

module.exports = Antamino
