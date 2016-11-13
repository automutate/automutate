# automutate

*[Rough Draft]* Applies waves of mutations provided by other tools, such as linters.

There are [various](https://github.com/eslint/eslint) [linters](https://github.com/palantir/tslint) [in](https://github.com/stylelint/stylelint) [the](https://github.com/lesshint/lesshint) [world](https://github.com/sasstools/sass-lint) and most are adding or have added ways to `--fix` rule failures automatically.
This is great but hard to do for a couple of reasons:
* **Overlapping rule failures** - The possibility of mutations appling to overlapping sets of characters requires logic to handle applying one, then re-runing linting, and so on.
* **Code bloat verses duplication** - Most linters either provide hooks to apply fixes themselves (which can result in code bloat) or have an external project (which duplicates logic for finding rules).

`automutate` proposes that linters only propose **how** to fix rules, via a standardized JSON format.
A linter-specific utility can request waves of these fixes to be passed into `automutate`.

Having a standardized source-agnostic project to apply mutations brings a couple of benefits:
* **Reduced overhead** - Projects no longer need to do this work themselves.
* **Standardized base** - Ramp-up time to switch between projects using `automutate` is reduced with common code.

In general, *detecting* rule failures is a separate concern from *fixing* them.
Linters need to run quickly over a read-only set of files, often during built processes, while fixers typically run slowly and modify files on user request.


## Mutations

A single mutation contains a unique `type` identifier, a range of character position(s) to apply to, and optionally other logic.

The following basic text manipulations are provided out of the box:
* **`multiple`** - Container for multiple mutations. This indicates to `automutate` that these must be applied all at once or not at all, which guarantees consistency with the built-in rule overlap detection.
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
        }]
}
```

Linter-specific utilities may define their own mutations.
For example, a language's linter may define a `node-rename` mutation rather than use a `multiple` mutation containing `text-swap` mutations.


## Mutators

Each mutation is tied to an implementation of the abstract [`Mutator`](https://github.com/autolint/automutate/blob/master/src/mutator.ts) class by name.
The default logic searches for these in user-provided directories under their `camelCase` name appended with `"Mutator"`.
`text-insert`, for example, would be matched to `mutators/testInsertMutator.js`.
