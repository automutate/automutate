# Case testers

These classes are provided as a convenience for packages that rely on `automutate`.

`TestFactory`'s constructor takes in two arguments:

1. A method to create a mutation provider for each file.
2. Names of files that test cases are composed of.

Its `describe` method takes in a a directory path containing test case directories.

## Sample Usage

Define a test file with JavaScript or TypeScript similar to the following:

```typescript
import * as path from "path";

import { MyMutationsProvider } from "../lib/MyMutationsProvider";
import { TestsFactory } from "automutate/test/cases/testsFactory";

(async (): Promise<void> => {
    const testsFactory = new TestsFactory(
        (fileName, settingsFileName) => new MyMutationsProvider(fileName, settingsFileName)
        {
            actual: "actual.txt",
            expected: "expected.txt",
            original: "original.txt",
            settings: "settings.txt"
        });

    await testsFactory.describe(path.join(__dirname, "cases"));
})();

```

Then, create a directory named `cases` with at least one sub-directory ("case").
Each case should contain files named `expected` and `original` with your extension.

When tests are run, the `original` file will be copied to an `actual` file and mutated.
It should then contain the same contents as the `expected` file.

Note that `TestsFactory` expects global `describe` and `it` functions to be declared.
If you're using a runner like Mocha or Jasmine this will work.
