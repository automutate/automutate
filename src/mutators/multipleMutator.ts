import { Mutation } from "../mutation";
import { Mutator } from "../mutator";
import { MutatorFactory } from "../mutatorFactory";
import {
  orderMutationsFirstToLast,
  orderMutationsLastToFirst,
} from "../ordering";

/**
 * Multiple mutations to be applied together.
 */
export interface MultipleMutations extends Mutation {
  /**
   * Mutations to be applied together.
   */
  mutations: Mutation[];

  /**
   * Unique type name identifying multiple mutations.
   */
  type: "multiple";
}

/**
 * Applies multiple mutations to a file.
 */
export class MultipleMutator extends Mutator {
  /**
   * Applies a mutation.
   *
   * @param fileContents   Current contents of the file.
   * @param mutation   Mutation to apply.
   * @returns File contents after applying the mutation.
   */
  public mutate(
    fileContents: string,
    mutation: MultipleMutations,
    mutatorFactory: MutatorFactory
  ): string {
    for (const childMutation of orderMutationsLastToFirst(mutation.mutations)) {
      fileContents = mutatorFactory.generateAndApply(
        fileContents,
        childMutation
      );
    }

    return fileContents;
  }
}

/**
 * Collects a set of mutations into a single "multiple" mutation.
 *
 * @param mutations   Mutations to be applied to a file.
 * @returns A single "multiple" mutation with the provided mutations in first-to-last order.
 * @remarks This assumes at least one mutation is being combined.
 */
export const combineMutations = (
  ...mutations: Mutation[]
): MultipleMutations => {
  let begin = mutations[0].range.begin;
  let end = mutations[0].range.end;

  for (const { range } of mutations) {
    begin = Math.min(begin, range.begin);

    if (range.end !== undefined && (end === undefined || range.end > end)) {
      end = range.end;
    }

    end =
      end === undefined
        ? Math.max(begin, range.begin)
        : Math.max(end, begin, range.begin);
  }

  return {
    mutations: orderMutationsFirstToLast(mutations),
    range: { begin, end },
    type: "multiple",
  };
};
