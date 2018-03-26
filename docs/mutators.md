# Mutators

Each mutation is tied to an implementation of the abstract [`Mutator`](https://github.com/autolint/automutate/blob/master/src/mutator.ts) class by name.
The default logic searches for these in user-provided directories under their `camelCase` name appended with `"Mutator"`.
`text-insert`, for example, would be matched to `mutators/testInsertMutator.js`.

Each mutator class is specific to a single type of mutation, and each mutator instance is specific to a file.
Calls to `mutate` are given the current file contents as a string, along with the mutation to be applied, and return the file contents after the mutation.

Given the following `text-insert-smiley` mutation interface:

```typescript
import { IMutation } from "automutate";

export interface ITextInsertSmileyMutation extends IMutation {
    /**
     * Unique type name identifying smiley insertion mutations.
     */
    type: "text-insert-smiley";
}
```

```javascript
import { Mutator } from "automutate";

const smiley = ":)";

export class InsertSmileyMutator {
    mutate(fileContents, mutation) {
        return [
            fileContents.substring(0, mutation.range.begin),
            smiley,
            fileContents.substring(mutation.range.begin),
        ].join("");
    }
}
```

Using `text-insert-smiley` mutations, the mutation from [Onboarding](onboarding.md) could be changed to:

```javascript
{
    range: {
        begin: 0
    },
    type: "text-insert-smiley",
}
```

## Advanced Mutators

Mutators are also given the *original* file contents at construction time, which allows for custom mutators to perform setup logic.
For example, a language's linter might create an abstract syntax tree for the file.

Given the following `node-rename` mutation interface:

```typescript
import { IMutation, IMutationRange } from "automutate";

export interface INodeRenameMutation extends IMutation {
    /**
     * New name for the node.
     */
    newName: string;

    /**
     * AST node being renamed. 
     */
     node: IMutationRange;

    /**
     * Unique type name identifying node rename mutations.
     */
    type: "node-name";
}
```

The `NodeRenameMutator` implementation would generate the file's abstract syntax tree in its constructor and act using that tree for each proposed mutation:

```javascript
import { Mutator } from "automutate";
import { AbstractSyntaxTree } from "your/language";

export class NodeRenameMutator {
    constructor(originalFileContents) {
        super(originalFileContents);

        this.ast = new AbstractSyntaxTree(originalFileContents);
    }

    mutate(fileContents, mutation) {
        const node = this.ast.getNodeAt(mutation.node.begin, mutation.node.end);
        node.rename(mutation.newName);

        for (const nodeReference of this.ast.getNodeReferences(node)) {
            nodeReference.rename(mutation.newName);
        }

        return [
            fileContents.substring(0, mutation.range.begin),
            this.ast.stringifyBetween(mutation.range.begin, mutation.range.end),
            fileContents.substring(mutation.range.end || mutation.range.begin),
        ].join("");
    }
}
```

As long as the mutator only applies changes within the range of the mutation, there's no change of conflict with other mutations.
