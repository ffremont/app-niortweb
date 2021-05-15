export interface User{
    email:string,
    fcm?:string,
    isAdmin?:boolean
    roles?: string[]
}