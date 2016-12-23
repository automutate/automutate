# Case testers

These classes are provided as a convenience for packages that rely on `automutate`.

`TestFactory`'s constructor takes in two arguments:

1. A method to create a mutation provider for each file.
2. The file extension to read files in test cases from.

Its `create` method takes in a a directory path containing test case directories.

## Sample Usage

Define a test file with TypeScript similar to the following:

```typescript
import * as path from "path";

import { MyMutationsProvider } from "../lib/MyMutationsProvider";
import { TestsFactory } from "automutate/test/cases/testsFactory";

(async (): Promise<void> => {
    const testsFactory = new TestsFactory(
        fileName => new MyMutationsProvider(fileName),
        ".txt");

    await testsFactory.create(path.join(__dirname, "cases"));
})();
```

Then, create a directory named `cases` with at least one sub-directory ("case").
Each case should contain files named `expected` and `original` with your extension.

When tests are run, the `original` file will be copied to an `actual` file and mutated.
It should then contain the same contents as the `expected` file.

Note that `TestsFactory` expects global `describe` and `it` functions to be declared.
If you're using a runner like Mocha or Jasmine this will work.
