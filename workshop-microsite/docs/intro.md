---
title: "Simple Rules, Strange Worlds"
sidebar_position: 1
sidebar_label: Introduction
---

# Simple Rules, Strange Worlds

## Models of Computation

A model of computation is an abstract, mathematical way of describing how a machine takes an input, follows a set of rules or instructions, and produces an output.

It is not a physical machine you can hold in your hand. It is more like a thinking framework: a way for us to ask, **what can be computed? How can it be computed? And what happens when simple instructions are repeated again and again?**

A cellular automaton is one specific kind of model of computation. Every cell on the grid updates at the same time. Each cell follows the same ruleset, looks only at its immediate neighbours, and decides what it should become next.

No cell waits for another cell. No cell asks for permission. The entire grid computes its next state in one simultaneous step.

That is what makes cellular automata so powerful: they turn simple rules into tiny digital worlds that can behave in surprisingly complex ways.

## A Few Key Terms

Every CA, no matter what it models, is built from the same six ingredients:

### Cell

The most basic unit of a CA.

A cell is one location on the grid, and it holds one value at a time.

### State

The value a cell holds at a particular moment.

In the simplest CAs, this is usually binary:
alive or dead, 1 or 0, ON or OFF.

In more complex models, there can be many possible states:
empty, prey, predator, burning, infected, and so on.

### Neighbourhood

The set of nearby cells that a cell looks at when deciding its next state.

The two most common neighbourhoods in two-dimensional CAs are:

- **Von Neumann neighbourhood**: four cells: up, down, left, right.
- **Moore neighbourhood**: eight cells: up, down, left, right, plus the four diagonals.

Basically, the cell checks its surroundings before making its next move.

### Ruleset

The rule set is the collection of instructions used by the CA.

The same rule set is applied to every cell on the grid, all at the same time.

### Rule

A rule is the instruction that maps the current state of a cell and its neighbourhood to the cell's next state.

In simpler terms:

> "Given what I am, and what my neighbours are doing, what should I become next?"

### Generation

A generation is one discrete time step.

Generation 0 is the starting condition, also called the seed. Every future pattern grows from that first state.

The entire history of a CA is just a sequence of generations unfolding from one starting point.

## Deterministic and Stochastic CA

Not all CAs work the same way. There is an important difference between two types of rule behaviour, and it matters for understanding the models you will meet in this course.

### Deterministic CA

A deterministic CA gives the same output every time from the same starting condition.

Every neighbourhood configuration maps to exactly one outcome. No randomness. No surprise plot twist. Just rules doing their rule thing.

For example, if a rule says:

```text
101 -> 1
```

Then whenever the neighbourhood is `101`, the new cell is always `1`.
Always.

Run the simulation ten times from the same seed, and you will get the same result every time for all neighbourhoods that the rule applies to.

Examples of deterministic CAs include:

- Conway's Game of Life
- Rule 30
- Rule 110

### Stochastic CA

A stochastic CA includes probability in its rules, so the same starting condition can produce different outcomes in different runs.

For example, if a prey cell has predator neighbours, it might die with 60% probability.

That means sometimes it dies, sometimes it survives, and you cannot know in advance exactly what will happen.

The forest fire model on the home page, the host-pathogen model, and the predator-prey biological models in this course are all examples of stochastic CAs.



***The difference is not about which one is "better." Both are useful for different reasons.***

Deterministic CAs are easier to analyse mathematically and easier to repeat exactly. Stochastic CAs are often more biologically realistic, because real systems are noisy.

Growing colonies, spreading infections, and competing organisms do not behave like perfectly timed robots. Not every cell divides at the same moment. Not every infection spreads after contact. Not every predator catches its prey.

Sometimes biology just says: maybe.

## Conway's Game of Life

One of the most famous cellular automata ever constructed is Conway's Game of Life, created by mathematician John Conway.

It is a two-dimensional, deterministic CA with two states:
alive or dead.

Its rules are simple:

- A live cell with fewer than two live neighbours dies, as if by underpopulation.
- A live cell with two or three live neighbours survives to the next generation.
- A live cell with more than three live neighbours dies, as if by overpopulation.
- A dead cell with exactly three live neighbours becomes alive, as if by reproduction.

Four rules. Two states. One grid.

And somehow, from this tiny rulebook, an extraordinary range of behaviour appears.

Explore the Game of Life here:
[https://playgameoflife.com/](https://playgameoflife.com/)

Try it out and let us know which patterns you find interesting.

The Game of Life is one of the clearest examples of the main idea behind cellular automata:
You do not need complex rules to get complex behaviour.

You need local rules, applied simultaneously, repeated across a large grid. The complexity is not hiding inside the instructions. It emerges from the interactions.

**Have you played with the forest fire model on the home page yet?**

`¯\_(ツ)_/¯`

## Why This Matters

Cellular automata are studied across mathematics, computer science, biology, physics, and many other fields because they reveal something very important:
simple rules can create complex behaviour.

The model is never a perfect copy of reality. It is a simplification; that is the point.

A CA makes the assumptions visible.

Every rule you write down is a claim about how the system works. Every parameter you adjust is a hypothesis about the biology, physics, or ecology behind the system. And when the simulation runs, it shows you what those assumptions predict: clearly, visually, and sometimes very dramatically.

That is what makes cellular automata such a useful scientific tool. They do not just teach us how to code; they show us what programming really makes possible: **building small rule-based worlds that help us think about the real one.**
