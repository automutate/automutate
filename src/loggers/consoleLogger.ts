import { Mutation } from "../mutation";
import { FileMutations, MutationsWave } from "../mutationsProvider";
import { Logger } from "../logger";

/**
 * Generates console logs for significant operations.
 */
export class ConsoleLogger implements Logger {
  /**
   * Mutations applied to each file, keyed by file name.
   */
  private readonly fileMutations: { [i: string]: Mutation[] } = {};

  /**
   * Waves of file mutations.
   */
  private readonly mutationsWaves: MutationsWave[] = [];

  /**
   * Logs that a mutation was applied.
   *
   * @param fileName   Name of the file to be mutated.
   * @param mutation   The requesting mutation.
   */
  public onMutation(fileName: string, mutation: Mutation): void {
    if (this.fileMutations[fileName]) {
      this.fileMutations[fileName].push(mutation);
    } else {
      this.fileMutations[fileName] = [mutation];
    }
  }

  /**
   * Logs that mutations have completed.
   */
  public onComplete(): void {
    const fileMutations: FileMutations = this.fileMutations;
    const filesCount: number = Object.keys(fileMutations).length;
    const mutationsCount: number = Object.keys(fileMutations)
      .map((fileName: string): number => fileMutations[fileName].length)
      .reduce((a: number, b: number): number => a + b, 0);
    const wavesCount: number = this.mutationsWaves.length;

    console.log(
      [
        "Completed ",
        this.pluralize(mutationsCount, "mutation"),
        " across ",
        this.pluralize(filesCount, "file"),
        " in ",
        this.pluralize(wavesCount, "wave"),
        ".",
      ].join("")
    );
  }

  /**
   * Logs that an unknown mutator was requested.
   *
   * @param mutation   The requesting mutation of unknown type.
   */
  public onUnknownMutationType(mutation: Mutation): void {
    console.error(`Unknown mutator type: '${mutation.type}'`);
  }

  /**
   * Logs that a mutations wave is about to start.
   */
  public onWaveBegin(): void {
    console.log("Starting new wave of mutations...");
  }

  /**
   * Logs that a mutations wave finished.
   */
  public onWaveEnd(): void {
    console.log("Ending wave.");
  }

  /**
   * Displays a word and number, accounting for pluralization.
   *
   * @param count   How many of the word there are.
   * @param word   A word to display.
   */
  private pluralize(count: number, word: string) {
    return count === 1 ? `${count} ${word}` : `${count} ${word}s`;
  }
}
