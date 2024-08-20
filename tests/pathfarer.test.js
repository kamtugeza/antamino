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
      .insert('read/category/article', 321)
      .insert('read/category/blog', 123)

    expect(instance.lookup('unknown')).toBe(undefined)
    expect(instance.lookup('create/acc')).toBe(undefined)
    expect(instance.lookup('create/account')).toBe(undefined)
    expect(instance.lookup('read/account')).toBe(undefined)
    expect(instance.lookup('read/category')).toBe(undefined)
    expect(instance.lookup('read/category/account')).toBe(undefined)
    expect(instance.lookup('read/customer/article')).toBe(undefined)
    expect(instance.lookup('create/article')).toEqual({ value: 'abc' })
    expect(instance.lookup('create/user')).toEqual({ value: { name: 'Rick Sanchez' } })
    expect(instance.lookup('read/article')).toEqual({ value: 'The article name is "abc"' })
    expect(instance.lookup('read/category/article')).toEqual({ value: 321 })
  })

  it('overrides the previous node value', () => {
    const instance = new Pathfarer().insert('create/article', 'abc').insert('create/article', 'def')

    expect(instance.lookup('create/article')).toEqual({ value: 'def' })
  })

  it('returns the value of the node with unique parametrized path', () => {
    const instance = new Pathfarer()
      .insert(':root', 'abc')
      .insert(':test/:nested', 123)
      .insert(':method/:category/:article', { author: 'Rick Sanchez' })

    expect(instance.lookup('alphabet')).toEqual({
      params: { root: 'alphabet' },
      value: 'abc',
    })
    expect(instance.lookup('alpha/beta')).toEqual({
      params: { test: 'alpha', nested: 'beta' },
      value: 123,
    })
    expect(instance.lookup('read/science/htmx')).toEqual({
      params: { article: 'htmx', category: 'science', method: 'read' },
      value: { author: 'Rick Sanchez' },
    })
  })

  it('returns the lookup result of the mock application routes', () => {
    const instance = new Pathfarer()
      .insert('read/', { title: 'Home' })
      .insert('read/blog', { title: 'Blog' })
      .insert('read/blog/:category', { title: 'Category' })
      .insert('read/blog/:category/:article', { title: 'Article' })
      .insert('read/blog/:category/:article/author', { title: 'Author' })
      .insert('create/blog/:article', { title: 'Create an Article' })

    expect(instance.lookup('read/')).toEqual({
      value: { title: 'Home' },
    })
    expect(instance.lookup('read/blog')).toEqual({
      value: { title: 'Blog' },
    })
    expect(instance.lookup('read/blog/science')).toEqual({
      params: { category: 'science' },
      value: { title: 'Category' },
    })
    expect(instance.lookup('read/blog/science/htmx')).toEqual({
      params: { article: 'htmx', category: 'science' },
      value: { title: 'Article' },
    })
    expect(instance.lookup('read/blog/science/htmx/author')).toEqual({
      params: { article: 'htmx', category: 'science' },
      value: { title: 'Author' },
    })
    expect(instance.lookup('create/blog/htmx')).toEqual({
      params: { article: 'htmx' },
      value: { title: 'Create an Article' },
    })
  })
})
