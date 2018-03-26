import { Logger } from "../logger";
import { IMutation } from "../mutation";
import { IFileMutations } from "../mutationsProvider";

// tslint:disable:no-console

/**
 * Generates console logs for significant operations.
 */
export class ConsoleLogger extends Logger {
    /**
     * Logs that mutations have completed.
     */
    public onComplete(): void {
        super.onComplete();

        const fileMutations: IFileMutations = this.getFileMutations();
        const filesCount: number = Object.keys(fileMutations).length;
        const mutationsCount: number = Object.keys(fileMutations)
            .map((fileName: string): number => fileMutations[fileName].length)
            .reduce((a: number, b: number): number => a + b, 0);
        const wavesCount: number = this.getMutationsWaves().length;

        console.log([
            "Completed ",
            this.pluralize(mutationsCount, "mutation"),
            " across ",
            this.pluralize(filesCount, "file"),
            " in ",
            this.pluralize(wavesCount, "wave"),
            ".",
        ].join(""));
    }

    /**
     * Logs that an unknown mutator was requested.
     *
     * @param mutation   The requesting mutation of unknown type.
     */
    public onUnknownMutationType(mutation: IMutation): void {
        super.onUnknownMutationType(mutation);

        console.error(`Unknown mutator type: '${mutation.type}'`);
    }

    /**
     * Displays a word and number, accounting for pluralization.
     *
     * @param count   How many of the word there are.
     * @param word   A word to display.
     */
    private pluralize(count: number, word: string) {
        return count === 1
            ? `${count} ${word}`
            : `${count} ${word}s`;
    }
}

// tslint:enable:no-console
