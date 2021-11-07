import { Mutation } from "./mutation";
import { MutationsWave } from "../mutationsProvider";

/**
 * Generates output messages for significant operations.
 */
export interface Logger {
  /**
   * Logs that mutations have completed.
   */
  onComplete(): void;

  /**
   * Logs that a mutation was applied.
   *
   * @param fileName   Name of the file to be mutated.
   * @param mutation   The requesting mutation.
   */
  onMutation(fileName: string, mutation: Mutation): void;

  /**
   * Logs that an unknown mutator was requested.
   *
   * @param mutation   The requesting mutation of unknown type.
   */
  onUnknownMutationType(mutation: Mutation): void;

  /**
   * Logs that a mutations wave is about to start.
   *
   * @param mutationsWave   A wave of file mutations.
   */
  onWaveBegin(mutationsWave: MutationsWave): void;

  /**
   * Logs that a mutations wave finished.
   *
   * @param mutationsWave   A wave of file mutations.
   */
  onWaveEnd(mutationsWave: MutationsWave): void;
}
