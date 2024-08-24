# Antamino

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [new Antamino()](#new-antamino)
  - [from()](#from)
  - [insert(pattern, value)](#insertpattern-value)
  - [lookup(path)](#lookuppath)
- [License](#license)

**Antamino** is a lightweight, zero-dependency routing storage solution built on the Radix Tree.

Designed for simplicity, Antamino allows you to associate various values — such as functions, objects, or primitives — with routes that include static and parameterized segments. While it provides essential routing functionality, those requiring more advanced features may consider exploring [find-my-way](https://github.com/delvedor/find-my-way/tree/main), which powers [Fastify](https://github.com/fastify/fastify)'s routing and is actively maintained by its contributors.

The name “Antamino” is inspired by the blend of words "ant" and “camino” (meaning “path” in Spanish), which symbolizes both direction and small but efficient movement.


## Installation

```bash
npm i antamino
```

## Usage

```js
const http = require('node:http')
const Antamino = require('@kamtugeza/antamino')

const routing = Antamino.from()
  .insert('GET/blog/:article', (article) => `<h1>${article}</h1>`)

const server = http.createServer((req, res) => {
  const { params, value } = routing.lookup(req.method + req.url)
  const body = value(params.article)
  res.writeHead(200).end(body)
})

server.listen(80)
```

## API

### new Antamino()

Creates an instance of the routing storage.

```js
const routing = new Antamino()
```

### from()

This static method creates a new instance of the routing storage in a functional way. You can use it as shown in the example below:

```js
const routing = Antamino.from()
```

### insert(pattern, value)

The `insert` method registers a new route and its associated value in the routing tree.

```js
const routing = Antamino.from()
  .insert('read/', renderHome)
  .insert('read/blog', renderBlock)
  .insert('read/blog/:article', renderArticle)
```

#### Values

The insert method is versatile, allowing you to associate any type of value with a route. For instance, in the example above, functions are bound to the routes, but you can as easily associate primitive values, objects, or other data types.

```js
const routing = Antamino.from().insert('/', 5)
```

This flexibility enables you to tailor the routing tree to your specific needs, whether to handle simple value retrieval or more complex routing logic.

#### HTTP Methods

The insert method does not inherently separate values by HTTP methods, offering you the flexibility to structure your routing tree as needed. In some scenarios, you might prefer to build the tree starting with the HTTP methods, which can speed up the matching process but might result in a more significant number of routes:

```js
const routing = Antamino.from().insert('GET/blog', renderBlog)
```

Alternatively, you can place HTTP methods at the end of the path and associate an object with handlers for each method:

```js
const routing = Antamino.from().insert('/blog', { GET: renderBlog })
```

#### Segment Types

The routing pattern supports two types of segments: static and parameterized.

- **Static Segments:** These are sets of alphabetical characters that match paths character by character. For example, the pattern `/blog` will match only the path `/blog`.
- **Parameterized Segments:** Also known as parameters, these segments consist of alphabetical characters enclosed between an opening `:` and a closing `/` characters. They match any subset of characters in the path and are used in the [lookup](#lookuppath) process to extract parameters from the path. For example, /blog/:article would match paths like `/blog/htmx`, `/blog/rick-cucumber`, or `/blog/node`.

### lookup(path)

The `lookup` method traverses the routing tree to find the route that matches the provided path. If a match is found, it returns an object containing the associated value and any dynamic parameters extracted from the path; if no match is found, it returns `undefined`.

```js
const routing = Antamino.from()
  .insert('/blog', 5)
  .insert('/blog/:article', renderArticle)

routing.lookup('/')           // undefined
routing.lookup('/blog')       // { value: 5 }
routing.lookup('/blog/htmx')  // { params: { article: 'htmx' }, value: renderArticle }
```

#### Lookup Result

The lookup response contains two properties: params and value.

- **value:** This is the value associated with the matched route. It can be any value you’ve decided to store with the route, such as a function, object, or primitive.
- **params:** This property holds an object in which each key corresponds to the name of a parameterized segment (the part of the pattern between `:` and `/` characters), and its value is part of the path that matches the parameterized segment. For example, if the route `/blog/:article` is matched by the path `/blog/htmx`, the `params` object will contain `{ article: 'htmx'  }`, representing the dynamic segment of the path.

## License

Licensed under [MIT](./LICENSE.md)
