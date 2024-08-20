import { describe, expect, it } from 'vitest'
import StaticNode from '../../lib/nodes/static'

describe('from', () => {
  it('creates an instance of the BasicNode', () => {
    expect(StaticNode.from('alpha', 0)).toEqual({
      endOfNode: 5,
      newNode: new StaticNode('alpha'),
    })
    expect(StaticNode.from('alpha/beta', 0)).toEqual({
      endOfNode: 10,
      newNode: new StaticNode('alpha/beta'),
    })
    expect(StaticNode.from('alpha/beta', 6)).toEqual({
      endOfNode: 10,
      newNode: new StaticNode('beta'),
    })
    expect(StaticNode.from('alpha/beta/gamma', 6)).toEqual({
      endOfNode: 16,
      newNode: new StaticNode('beta/gamma'),
    })
    expect(StaticNode.from('alpha/:beta', 0)).toEqual({
      endOfNode: 6,
      newNode: new StaticNode('alpha/'),
    })
    expect(StaticNode.from('alpha/:beta/gamma', 12)).toEqual({
      endOfNode: 17,
      newNode: new StaticNode('gamma'),
    })
  })
})

describe('fork', () => {
  it('splits the node at the position and returns a new parent node', () => {
    const alphaNode = new StaticNode('alpha')
    const rootNode = new StaticNode().setChildNode(alphaNode)

    const result = alphaNode.fork(rootNode, 'alto', 0)
    const expected = new StaticNode('al').setChildNode(new StaticNode('pha'))
    expect(rootNode.getChildNode('a')).toEqual(expected)
    expect(result).toEqual(expected)
  })
})

describe('getEndOfNode', () => {
  it('returns the index at which the node ends within the path', () => {
    expect(new StaticNode('alpha').getEndOfNode('alpha', 0)).toBe(5)
    expect(new StaticNode('alpha').getEndOfNode('alpha/beta', 0)).toBe(5)
    expect(new StaticNode('alpha').getEndOfNode('alpha/:beta', 0)).toBe(5)
    expect(new StaticNode('beta').getEndOfNode('alpha/beta', 6)).toBe(10)
  })
})

describe('matches', () => {
  it('returns `true` when the node prefix matches the part of the path starting from the specified position; otherwise, it returns `false`', () => {
    expect(new StaticNode('apple').matches('alpha', 0)).toBe(false)
    expect(new StaticNode('alpha').matches('alpha', 0)).toBe(true)
    expect(new StaticNode('beta').matches('alpha/beta', 6)).toBe(true)
  })
})
