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
        }]
}
```

Linter-specific utilities may define their own mutations.
For example, a language's linter may define a `node-rename` mutation rather than use a `multiple` mutation containing `text-swap` mutations.


## Mutators

Each mutation is tied to an implementation of the abstract [`Mutator`](https://github.com/autolint/automutate/blob/master/src/mutator.ts) class by name.
The default logic searches for these in user-provided directories under their `camelCase` name appended with `"Mutator"`.
`text-insert`, for example, would be matched to `mutators/testInsertMutator.js`.

Each mutator class is specific to a single type of mutation, and each mutator instance is specific to a file.
Calls to `mutate` are given the current file contents as a string, along with the mutation to be applied, and return the file contents after the mutation.

Mutators are also given the *original* file contents at construction time, which allows for custom mutators to perform setup logic (for example, a language's linter creating an abstract syntax tree for the file).


# Project Onboarding

In order to be compatible with `automutate`, a linter must allow for some rules to report proposed fixes using the standard format.
Once that is possible, it's a matter of creating a [mutations provider](https://github.com/autolint/automutate/blob/master/src/mutationsProvider.ts) that continuously retrieves these proposed fixes using the linter.
