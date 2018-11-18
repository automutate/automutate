/**
 * Character positions a mutation affects.
 */
export interface IMutationRange {
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
export interface IMutation {
    /**
     * Character positions this affects.
     */
    readonly range: IMutationRange;

    /**
     * Unique type name identifying this mutation.
     */
    readonly type: string;
}

/**
 * Multiple mutations to be applied together.
 */
export interface IMutations extends IMutation {
    /**
     * Mutations to be applied together.
     */
    readonly mutations: ReadonlyArray<IMutation>;

    /**
     * Unique type name identifying multiple mutations.
     */
    readonly type: "multiple";
}
