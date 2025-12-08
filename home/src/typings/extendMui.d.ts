// home/src/typings/extendMui.d.ts

/**
 * FINAL TEMPORARY DECLARATION for ExtendMui
 * * Defines ExtendMui as a generic type that accepts two parameters (T1 and T2), 
 * where the second parameter is optional (T2 = any).
 * This structure satisfies the calling code: 
 * ExtendMui<BaseTextFieldProps, 'variant' | 'onError' | 'value'>
 */
// Make the first parameter required, and the second optional with a default value.
export type ExtendMui<T1 = any, T2 = any> = any; 

// Resolve default export (if used elsewhere)
declare const content: any;
export default content;