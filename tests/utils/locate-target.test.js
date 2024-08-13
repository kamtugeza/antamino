import { expect, it } from 'vitest'
import StaticNode from '../../lib/nodes/static-node'
import locateTarget from '../../lib/utils/locate-target'

it('returns the matching node', () => {
  const betaNode = StaticNode.from('beta')
  const alphaNode = StaticNode.from('alpha/').setChild(betaNode)
  const rootNode = StaticNode.from('').setChild(alphaNode)

  expect(locateTarget(rootNode, 'alpha/beta', 0)).toBe(alphaNode)
  expect(locateTarget(alphaNode, 'alpha/beta', 6)).toBe(betaNode)
})

it('return the forked node when matching prefix does not equal to the path', () => {
  const betaNode = StaticNode.from('beta')
  const alphaNode = StaticNode.from('alpha/').setChild(betaNode)
  const rootNode = StaticNode.from('').setChild(alphaNode)

  expect(locateTarget(rootNode, 'alpha/better', 0)).toBe(alphaNode)
  expect(locateTarget(alphaNode, 'alpha/better', 6)).toEqual(
    StaticNode.from('bet').setChild(StaticNode.from('a')),
  )
})
