# automutate

[![Greenkeeper badge](https://badges.greenkeeper.io/automutate/automutate.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/automutate/automutate.svg?branch=master)](https://travis-ci.org/automutate/automutate)
[![npm](https://img.shields.io/npm/v/automutate.svg)](https://www.npmjs.com/package/automutate)

Applies waves of mutations provided by other tools, such as linters.

There are [many](https://github.com/eslint/eslint) [linters](https://github.com/palantir/tslint) [in](https://github.com/stylelint/stylelint) [the](https://github.com/lesshint/lesshint) [world](https://github.com/sasstools/sass-lint) and most are adding or have added ways to `--fix` rule failures automatically.
This is great but hard to do for a couple of reasons:
* **Overlapping rule failures** - The possibility of mutations appling to overlapping sets of characters requires logic to handle applying one, then re-running linting, and so on.
* **Code bloat verses duplication** - Most linters either provide hooks to apply fixes themselves (which can result in code bloat) or have an external project (which duplicates logic for finding rules).

`automutate` proposes that linters only propose **how** to fix rules, via a standardized JSON format.

Having a standardized source-agnostic project to apply mutations brings a couple of benefits:
* **Reduced overhead** - Projects no longer need to do this work themselves.
* **Standardized base** - Ramp-up time to switch between projects using `automutate` is reduced with common code.

In general, *detecting* rule failures is a separate concern from *fixing* them.
Linters need to run quickly over a read-only set of files, often during built processes, while fixers typically run slowly and modify files on user request.


## How it works

The main `automutate` algorithm is started in [`autoMutator.ts`](../src/autoMutator.ts) and mostly applied in [`mutationsApplier.ts`](../src/mutationsApplier.ts):

```swift
while mutationsWave = getMutationsWave():
    for (file, fileMutations) of groupMutationsByFile(mutationsWave):
        for mutation of getNonOverlappingMutationsInReverse(fileMutations):
            applyMutation(file, mutation)
```

1. `getMutationsWave` calls to an external tool, such as a linter, to receive a wave of suggested mutations.
2. `groupMutationsByFile` organizes the suggested mutations by file.
3. `getNonOverlappingMutationsInReverse` removes overlapping mutations that would conflict with each other, and sorts the remainder in reverse order so that later mutations don't interfere with character positions of earlier mutations.
4. `applyMutation`  modifies files on disk using the remaining mutations.


## Mutations

A single mutation contains a unique `type` identifier, a range of character position(s) to apply to, and optionally other logic.

The following basic text manipulations are provided out of the box:
* **`multiple`** - Container for multiple mutations. This indicates to `automutate` that these must be applied all at once or not at all, which guarantees consistency with the built-in mutation overlap detection.
* **`text-delete`** - Deletes a range of characters.
* **`text-insert`** - Inserts a string at a point.
* **`text-replace`** - Replaces characters matching a string or regular expression within a range.
* **`text-swap`** - Swaps a range of characters with a new string.

For example:

```json
{
    "ugly-file.txt": [
        {
            "range": {
                "begin": 7,
                "end": 14
            },
            "type": "text-delete"
        },
        {
            "insertion": "inconceivable!",
            "range": {
                "begin": 21
            },
            "type": "text-insert"
        }
    ]
}
```

Linter-specific utilities may define their own mutations.
For example, a language's linter may define a `node-rename` mutation rather than use a `multiple` mutation containing `text-swap` mutations.

See [Mutators](docs/mutators.md) for more on custom mutators.


# Project Onboarding

See [Onboarding](docs/onboarding.md).

`automutate` requires NodeJS >= 4.
