import { describe, expect, it } from 'vitest'
import Pathfarer from '../lib/pathfarer'

describe('from', () => {
  it('creates an instance of the BasicNode', () => {
    expect(Pathfarer.from()).toEqual(new Pathfarer())
  })
})

describe('insert/lookup', () => {
  it('returns the value of the root node', () => {
    const instance = new Pathfarer().insert('', 1)

    expect(instance.lookup('')).toEqual({ value: 1 })
  })

  it('returns the value of the node with a unique static path', () => {
    const instance = new Pathfarer().insert('create/article', 1).insert('read/article', ['abc'])

    expect(instance.lookup('create/article')).toEqual({ value: 1 })
    expect(instance.lookup('read/article')).toEqual({ value: ['abc'] })
  })

  it('returns the value of the node with shared part of the static path', () => {
    const instance = new Pathfarer()
      .insert('create/article', 'abc')
      .insert('create/user', { name: 'Rick Sanchez' })
      .insert('read/article', 'The article name is "abc"')

    expect(instance.lookup('unknown')).toBe(undefined)
    expect(instance.lookup('create/art')).toBe(undefined)
    expect(instance.lookup('create/artaaaa')).toBe(undefined)
    expect(instance.lookup('create/article')).toEqual({ value: 'abc' })
    expect(instance.lookup('create/user')).toEqual({ value: { name: 'Rick Sanchez' } })
    expect(instance.lookup('read/article')).toEqual({ value: 'The article name is "abc"' })
  })

  it('overrides the previous node value', () => {
    const instance = new Pathfarer().insert('create/article', 'abc').insert('create/article', 'def')

    expect(instance.lookup('create/article')).toEqual({ value: 'def' })
  })
})
