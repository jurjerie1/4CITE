export interface NewHotel {
    name: String,
    location: String,
    description: String,
    picture_list: String[],
}

export interface Hotel extends NewHotel {
    _id: string
}