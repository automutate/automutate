/// <reference path="../../node_modules/@types/mocha/index.d.ts" />

import { expect } from "chai";

import { CaseSearcher } from "./caseSearcher";
import { CaseGrouper } from "./caseGrouper";
import { CaseVerifier } from "./caseVerifier";
import { CaseRunner } from "./caseRunner";
import { TestRunner } from "./testRunner";

declare const run: () => void;

(async (onComplete: () => void): Promise<void> => {
    const caseSearcher: CaseSearcher = new CaseSearcher(__dirname);
    const caseGrouper: CaseGrouper = new CaseGrouper();
    const caseRunner = new CaseRunner(
        (actual: string, expected: string) => expect(actual).to.be.equal(expected));
    const caseVerifier: CaseVerifier = new CaseVerifier(caseRunner, describe, it);
    const testRunner: TestRunner = new TestRunner(caseSearcher, caseGrouper, caseVerifier);

    await testRunner
        .run()
        .then(onComplete)
        .catch(error => {
            console.error("Error running tests:", error);
        });
})(run);