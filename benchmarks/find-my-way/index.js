const { performance } = require('node:perf_hooks')
const buildFindMyWay = require('find-my-way')
const { patterns, requests } = require('../data')

const routing = buildFindMyWay()

for (const method of ['DELETE', 'GET', 'POST', 'PUT']) {
  for (const pattern of patterns) routing.on(method, pattern, () => {})
}

const circles = 100
const stepsPerCircle = 1_000_000
const executionTimes = []

for (let circle = 0; circle <= circles; circle++) {
  const start = performance.now()
  for (let step = 0; step <= stepsPerCircle; step++) {
    const variant = Math.floor(Math.random() * 100)
    const request = requests[variant]
    routing.lookup(request)
  }
  const end = performance.now()
  executionTimes.push(end - start)
}

const averageMs = executionTimes.reduce((acc, val) => acc + val, 0) / executionTimes.length

console.log({ averageMs, circles, stepsPerCircle })
