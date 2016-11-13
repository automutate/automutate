/**
 * Character positions a mutation affects.
 */
export interface IMutationRange {
    /**
     * Inclusive character position this starts at.
     */
    begin: number;

    /**
     * Exclusive character position this ends at.
     */
    end?: number;
}

/**
 * Description of a mutation to be applied to a file.
 */
export interface IMutation {
    /**
     * Character positions this affects.
     */
    range: IMutationRange;

    /**
     * Unique type name identifying this mutation.
     */
    type: string;
}

/**
 * Multiple mutations to be applied together.
 */
export interface IMutations extends IMutation {
    /**
     * Mutations to be applied together.
     */
    mutations: IMutation[];

    /**
     * Unique type name identifying multiple mutations.
     */
    type: "multiple";
}
