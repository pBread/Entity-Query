/****************************************************
 Main
****************************************************/
export declare function EntityQuery<T extends {
    [key: string]: R;
}, R extends Obj>(entities: T): {
    filter(query?: Query, options?: QueryOptions): R[];
    search(query?: Query, options?: QueryOptions): string[];
};
export default EntityQuery;
declare type Obj = {
    id: string;
    [key: string]: any;
};
export declare type Query = {
    [key: string]: any;
};
declare type QueryOptions = {
    conditions?: "all" | "any" | "diff" | "none";
};
