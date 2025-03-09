import mongoose from 'mongoose'

export async function connectDB() {
    await mongoose.connect(
        `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@localhost:27017/${process.env.MONGO_DB}?authSource=admin`
        // `mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PWD}@cluster0.xzrgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    )
        .then(() => {
            console.log('connecté à mongo DB')
        })
        .catch((err) => {
            console.log(`Erreur de connection à la base de donnée`)
            console.log(err)
        })
}