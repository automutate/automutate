import { CaseSearcher } from "./caseSearcher";
import { CaseGrouper } from "./caseGrouper";
import { CaseVerifier } from "./caseVerifier";
import { CaseRunner } from "./caseRunner";
import { TestRunner } from "./testRunner";

const caseSearcher = new CaseSearcher(import.meta.url);
const caseGrouper = new CaseGrouper();
const caseRunner = new CaseRunner((actual, expected: string) =>
  expect(actual).toEqual(expected)
);
const caseVerifier = new CaseVerifier(caseRunner, describe, it);
const testRunner = new TestRunner(caseSearcher, caseGrouper, caseVerifier);

await testRunner.run();

describe("wat", () => {
  it("hi", () => {});
});
