/**
 * Description of a mutation to be applied to a file.
 */
export interface IMutation {
    /**
     * Inclusive start and exclusive end character positions this affects.
     */
    range: [number, number];

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
