import { describe, expect, it } from 'vitest'
import BasicNode from '../../lib/nodes/basic'

describe('get/set a child node', () => {
  it('preserves an instance of the BasicNode', () => {
    const node = new BasicNode()
    const alpha = new BasicNode('abc')

    expect(node.setChildNode(alpha)).toBe(node)
    expect(node.getChildNode('a')).toBe(alpha)
  })
})

describe('fork', () => {
  it('returns the current node as it is', () => {
    const alphaNode = new BasicNode('alpha')
    const rootNode = new BasicNode('root').setChildNode(alphaNode)

    expect(rootNode.fork(null, 'alpha', 0)).toBe(rootNode)
    expect(alphaNode.fork(rootNode, 'alpha', 0)).toBe(alphaNode)
  })
})

describe('matches', () => {
  it('returns always `true`', () => {
    expect(new BasicNode().matches()).toBe(true)
    expect(new BasicNode().matches('alpha', 0)).toBe(true)
  })
})

describe('paramAt', () => {
  it('returns `undefined` when there is no param names', () => {
    const node = new BasicNode('node')
    expect(node.paramAt(0)).toBe(undefined)
    expect(node.paramAt(1)).toBe(undefined)
  })

  it('returns the param name at the specified position', () => {
    const node = new BasicNode('node')
    node.paramNames = ['alpha', 'beta']
    expect(node.paramAt(0)).toBe('alpha')
    expect(node.paramAt(1)).toBe('beta')
    expect(node.paramAt(2)).toBe(undefined)
  })
})

describe('readParamName', () => {
  it('returns always `undefined`', () => {
    expect(new BasicNode('alpha').readParamName('alpha', 0, 5)).toBe(undefined)
    expect(new BasicNode('alpha').readParamName('alpha/beta', 0, 5)).toBe(undefined)
  })
})

describe('readParamValue', () => {
  it('returns always `undefined`', () => {
    expect(new BasicNode('alpha').readParamValue('alpha', 0, 5)).toBe(undefined)
    expect(new BasicNode('alpha').readParamValue('alpha/beta', 0, 5)).toBe(undefined)
  })
})
