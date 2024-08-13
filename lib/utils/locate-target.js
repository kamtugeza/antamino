import StaticNode from '../nodes/static-node'

/**
 * Locates a child node of the current node based on the specified path and position.
 * 
 * If the child node is a `StaticNode` and its prefix does not match the path starting from the given
 * position, the child node is split into two separate nodes:
 * 
 * - Left Node: A new node containing the portion of the original child node’s prefix that matches
 * the path starting from the specified position. This new node replaces the original child node in
 * the current node’s children list.
 * - Right Node: The original child node, now containing the remaining portion of its prefix that
 * does not match the path from the specified position, is attached as a child of the left node.

 * @param {import('../nodes/basic-node').default} node - The current node.
 * @param {string} path - The path to search within.
 * @param {number} position - The position in the path for locating the child node.
 * @returns {import('../nodes/basic-node').default | undefined}
 */
export default function findTarget(node, path, position) {
  const childNode = node.getChild(path.charAt(position))

  if (childNode instanceof StaticNode) {
    for (let index = 0; index < childNode.prefix.length; index++) {
      const isFork = path.charAt(position + index) !== childNode.prefix.charAt(index)
      if (isFork) return childNode.fork(node, index)
    }
  }

  return childNode
}
