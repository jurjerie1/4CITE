import mongoose from 'mongoose'

export function connectDB() {
    mongoose.connect(
        `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@localhost:27017/${process.env.MONGO_DB}?authSource=admin`
    )
        .then(() => {
            console.log('connecté à mongo DB')
        })
        .catch((err) => {
            console.log(`Erreur de connection à la base de donnée`)
            console.log(err)
        })
}