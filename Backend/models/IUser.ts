export interface NewUser {
    email: String,
    pseudo: String, 
    password: String, 
    role: Number
}

export interface User extends NewUser {
    _id: string
}