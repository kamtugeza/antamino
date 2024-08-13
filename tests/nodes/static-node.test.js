import { describe, expect, it } from 'vitest'
import BasicNode from '../../lib/nodes/basic-node'
import StaticNode from '../../lib/nodes/static-node'

describe('from', () => {
  it('creates an instance of the BasicNode', () => {
    expect(StaticNode.from('abc', 0)).toEqual(new StaticNode('abc', 0))
    expect(StaticNode.from('def', 1)).toEqual(new StaticNode('def', 1))
    expect(StaticNode.from()).toBeInstanceOf(BasicNode)
  })
})

describe('fork', () => {
  it('splits the node at the position and returns a new parent node', () => {
    const alphaNode = StaticNode.from('alpha')
    const rootNode = StaticNode.from().setChild(alphaNode)

    const result = alphaNode.fork(rootNode, 2)
    const expected = StaticNode.from('al').setChild(StaticNode.from('pha'))
    expect(rootNode.getChild('a')).toEqual(expected)
    expect(result).toEqual(expected)
  })
})
