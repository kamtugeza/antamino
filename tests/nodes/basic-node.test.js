import { describe, expect, it } from 'vitest'
import BasicNode from '../../lib/nodes/basic-node'

describe('from', () => {
  it('creates an instance of the BasicNode', () => {
    expect(BasicNode.from('abc', 0)).toEqual(new BasicNode('abc', 0))
    expect(BasicNode.from('def', 1)).toEqual(new BasicNode('def', 1))
  })
})

describe('get/set child', () => {
  it('preserves an instance of the BasicNode', () => {
    const node = BasicNode.from()
    const alpha = BasicNode.from('abc')

    expect(node.setChild(alpha)).toBe(node)
    expect(node.getChild('a')).toBe(alpha)
  })
})
