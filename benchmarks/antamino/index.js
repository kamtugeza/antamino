const { performance } = require('node:perf_hooks')
const Antamino = require('../../lib/antamino')
const { patterns, requests } = require('../data')

const routing = Antamino.from()

for (const method of ['DELETE', 'GET', 'POST', 'PUT']) {
  for (const pattern of patterns) routing.insert(`${method}${pattern}`, () => {})
}

const circles = 100
const stepsPerCircle = 1_000_000
const executionTimes = []

for (let circle = 0; circle <= circles; circle++) {
  const start = performance.now()
  for (let step = 0; step <= stepsPerCircle; step++) {
    const variant = Math.floor(Math.random() * 100)
    const request = requests[variant]
    routing.lookup(`${request.method}${request.url}`)
  }
  const end = performance.now()
  executionTimes.push(end - start)
}

const averageMs = executionTimes.reduce((acc, val) => acc + val, 0) / executionTimes.length

console.log({ averageMs, circles, stepsPerCircle })
