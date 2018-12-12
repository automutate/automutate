import { IMutation } from "./mutation";

/**
 * Orders a set of mutations first-to-last.
 *
 * @param mutations   Mutations to be applied to a file.
 * @returns The mutations in first-to-last order.
 */
export const orderMutationsFirstToLast = (mutations: ReadonlyArray<IMutation>): IMutation[] =>
    mutations.slice().sort((a: IMutation, b: IMutation): number =>
        (a.range.end || a.range.begin) - (b.range.end || b.range.begin));

/**
 * Orders a set of mutations last-to-first.
 *
 * @param mutations   Mutations to be applied to a file.
 * @returns The mutations in last-to-first order.
 */
export const orderMutationsLastToFirst = (mutations: ReadonlyArray<IMutation>): IMutation[] =>
    mutations.slice().sort((a: IMutation, b: IMutation): number =>
        (b.range.end || b.range.begin) - (a.range.end || a.range.begin));

/**
 * Orders a set of mutations last-to-first, without overlaps.
 *
 * @param mutations   Mutations to be applied to a file.
 * @returns The mutations in last-to-first order, without overlaps.
 */
export const orderMutationsLastToFirstWithoutOverlaps = (mutations: ReadonlyArray<IMutation>): IMutation[] => {
    const ordered = orderMutationsLastToFirst(mutations);
    const orderedWithoutOverlaps: IMutation[] = [];
    let lastStart = Infinity;

    for (let i: number = ordered.length - 1; i >= 0; i -= 1) {
        const mutation: IMutation = ordered[i];
        if ((mutation.range.end || mutation.range.begin) >= lastStart) {
            continue;
        }

        lastStart = mutation.range.begin;
        orderedWithoutOverlaps.push(mutation);
    }

    return orderedWithoutOverlaps;
};
