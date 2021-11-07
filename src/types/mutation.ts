/**
 * Character positions a mutation affects.
 */
export interface MutationRange {
  /**
   * Inclusive character position this starts at.
   */
  readonly begin: number;

  /**
   * Exclusive character position this ends at.
   */
  readonly end?: number;
}

/**
 * Description of a mutation to be applied to a file.
 */
export interface Mutation {
  /**
   * Character positions this affects.
   */
  readonly range: MutationRange;

  /**
   * Unique type name identifying this mutation.
   */
  readonly type: string;
}

/**
 * Multiple mutations to be applied together.
 */
export interface Mutations extends Mutation {
  /**
   * Mutations to be applied together.
   */
  readonly mutations: ReadonlyArray<Mutation>;

  /**
   * Unique type name identifying multiple mutations.
   */
  readonly type: "multiple";
}
