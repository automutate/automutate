# Onboarding

Automutate works by repeatedly running a "provider" that generates mutation suggestions.
It will keep running until no more suggestions are provided.

That provider is typically a thin wrapper around an external tool such as a linter.

**Any linter can be onboarded onto Automutate**.


## Optional Preqrequisites

These will make the onboarding process smoother.
They're also good ideas to consider for your code structure.

### Dedicated Runner

Expose a single class or function that runs linting logic.
It should be possible to import and run it directly.

If your linter is only runnable via a CLI, you'll need to execute a CLI process and capture its output.
That's doable but but messy and inefficient.

### Reporting Suggestions

Automutate works best when it does the least.
Have your linter provide fix suggestions in some format so that all your autolinter needs to do is convert them to waves of `IMutation`s.

If your linter does not yet provide fix suggestions, you'll need to write converter logic to generate `IMutation`s from the lint output.
That's doable but carries two major downsides:
* Your logic will be at risk getting out of sync.
    * If your linter is updated to produce different output, you'll need to separately update the converter logic.
    * Users may not know they need to update their autolinter along with your linter, and end up with bad autolinting.
* Fix suggestions won't have the full information used to generate complaints, such as abstract syntax trees or source files.


## Technical Implementation

Automutation is driven by an instance of the [`AutoMutator` class](../src/autoMutator.ts).
It requires an [`IMutationsProvider`](../src/mutationsProvider.ts) to generate suggestions that will be applied to files.

A base setup would look something like:

```javascript
import { AutoMutator } from "automutate";

import { SmileyMutationsProvider } from "./smileyMutationsProvider";

export function createMyAutomutator() {
    return new AutoMutator({
        mutationsProvider: new SmileyMutationsProvider(),
    });
}
```

### `IMutationsProvider`

An `IMutationsProvider` must implement a `provide()` method that returns a `Promise` for an `IMutationsWave`.
See [`mutationsProvider.ts`](../src/mutationsProvider.ts) for the interface definitions.

`provide` will be called continuously until its result doesn't contain a `fileMutations` member.
This is where the bulk of your logic will live.

A simple provider that adds a `:)\n` string to the top of a file would look something like:

```javascript
import * as fs from "mz/fs";

const smiley = ":)\n";

export class SmileyMutationsProvider {
    async provide() {
        const data = await fs.readFile("my-file.txt");

        return this.generateMutations(data.toString());
    }

    generateMutations(text) {
        if (text.substring(smiley.length) === smiley) {
            return {};
        }

        return {
            fileMutations: [
                {
                    insertion: smiley,
                    range: {
                        begin: 0
                    },
                    type: "text-insert",
                },
            ],
        };
    }
}
```

Autolinters use `provide` to run their linter and convert its output to file mutations.
