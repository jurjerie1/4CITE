export interface NewHotel {
    name: String,
    location: String,
    description: String,
}

export interface Hotel extends NewHotel {
    _id: string
}