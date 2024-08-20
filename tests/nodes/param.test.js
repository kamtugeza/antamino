import { describe, expect, it } from 'vitest'
import ParamNode from '../../lib/nodes/param'

describe('from', () => {
  it('creates an instance of the BasicNode', () => {
    expect(ParamNode.from(':alpha', 0)).toEqual({
      endOfNode: 6,
      newNode: new ParamNode(),
    })
    expect(ParamNode.from(':alpha/:beta', 0)).toEqual({
      endOfNode: 7,
      newNode: new ParamNode(),
    })
    expect(ParamNode.from(':alpha/:beta', 7)).toEqual({
      endOfNode: 12,
      newNode: new ParamNode(),
    })
    expect(ParamNode.from('alpha', 0)).toBe(undefined)
  })
})

describe('getEndOfNode', () => {
  it('returns the index at which the node ends within the path pattern', () => {
    expect(new ParamNode().getEndOfNode(':beta', 0)).toBe(5)
    expect(new ParamNode().getEndOfNode(':beta/gamma', 0)).toBe(6)
    expect(new ParamNode().getEndOfNode(':beta/:gamma', 6)).toBe(12)
  })
})

describe('readParamNode', () => {
  it('reads and returns the param name from the path when the node is a `ParamNode`; otherwise, it returns `undefined`', () => {
    expect(new ParamNode().readParamName('alpha', 0, 5)).toBe(undefined)
    expect(new ParamNode().readParamName(':alpha', 0, 6)).toBe('alpha')
    expect(new ParamNode().readParamName(':alpha/:beta', 0, 7)).toBe('alpha')
    expect(new ParamNode().readParamName(':alpha/:beta', 7, 12)).toBe('beta')
  })
})

describe('readParamValue', () => {
  it('reads and returns the param value from the path', () => {
    expect(new ParamNode().readParamValue('alpha', 0, 5)).toBe('alpha')
    expect(new ParamNode().readParamValue('alpha/beta', 0, 6)).toBe('alpha')
    expect(new ParamNode().readParamValue('alpha/beta', 6, 10)).toBe('beta')
  })
})
