/****************************************************
 Main
****************************************************/
export default function EntityQuery<T extends {
    [key: string]: R;
}, R extends Obj>(entities: T): {
    filter(query?: Query, options?: QueryOptions): R[];
    search(query?: Query, options?: QueryOptions): string[];
};
export declare type Query = {
    [key: string]: any;
};
export declare type QueryOptions = {
    conditions?: "all" | "any" | "diff" | "none";
};
declare type Obj = {
    id: string;
    [key: string]: any;
};
export {};
