import { FileMutations, MutationsWave } from "../mutationsProvider";
import { Mutation } from "./mutation";

/**
 * Generates output messages for significant operations.
 */
export interface Logger {
  /**
   * Logs that a mutation was applied.
   *
   * @param fileName   Name of the file to be mutated.
   * @param mutation   The requesting mutation.
   */
  onMutation?(fileName: string, mutation: Mutation): void;

  /**
   * Logs that a mutations is about to be applied.
   *
   * @param mutation   File mutation to be applied.
   */
  onMutationApplyBegin?(mutation: Mutation): void;

  /**
   * Logs that mutations were applied.
   *
   * @param mutation   File mutation to be applied.
   */
  onMutationApplyEnd?(mutation: Mutation): void;

  /**
   * Logs that mutations are about to be applied.
   *
   * @param fileMutations   File mutations to be applied.
   */
  onMutationsApplyBegin?(fileMutations: FileMutations): void;

  /**
   * Logs that mutations were applied.
   *
   * @param fileMutations   File mutations to be applied
   */
  onMutationsApplyEnd?(fileMutations: FileMutations): void;

  /**
   * Logs that a wave mutations is going to be provided.
   */
  onProvideBegin?(): void;

  /**
   * Logs that a wave mutations is was provided.
   */
  onProvideEnd?(mutationsWave: MutationsWave): void;

  /**
   * Logs that mutations are going to begin.
   */
  onRunMutationsBegin?(): void;

  /**
   * Logs that mutations have completed.
   */
  onRunMutationsEnd?(): void;

  /**
   * Logs that an unknown mutator was requested.
   *
   * @param mutation   The requesting mutation of unknown type.
   */
  onUnknownMutationType?(mutation: Mutation): void;
}
