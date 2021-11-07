/* eslint-disable @typescript-eslint/no-empty-function */
import { Logger } from "../types/logger";

/**
 * No-operation logger that does nothing.
 */
export class NoopLogger implements Logger {
  /**
   * Logs that a mutation was applied.
   */
  public onMutation(): void {}

  /**
   * Logs that mutations have completed.
   */
  public onComplete(): void {}

  /**
   * Logs that an unknown mutator was requested.
   */
  public onUnknownMutationType(): void {}

  /**
   * Logs that a mutations wave is about to start.
   */
  public onWaveBegin(): void {}

  /**
   * Logs that a mutations wave finished.
   */
  public onWaveEnd(): void {}
}
