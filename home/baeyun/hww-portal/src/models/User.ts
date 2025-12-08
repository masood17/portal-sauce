// Inside hww-portal/src/models/User.ts
export default interface User {
    // [key: string]: any; is a 'wildcard' to satisfy TypeScript initially
    name: string;
    [key: string]: any; 
}