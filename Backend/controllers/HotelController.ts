import { Request, Response, NextFunction } from 'express';
import HotelRepository from 'repositories/hotelRepository.ts';
import { Hotel, IHotel } from '../models/Hotel.ts';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { get } from 'http';

//#region Multer configuration

const hotelRepository = new HotelRepository(Hotel);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de multer pour stocker temporairement les fichiers
const tempStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = path.join(__dirname, '/public/uploads/temp');
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}.${file.mimetype.split('/')[1]}`);
    }
});

// Filtre pour accepter uniquement les images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Seules les images sont autorisées!'), false);
    }
};

export const upload = multer({
    storage: tempStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});

// Fonction pour déplacer les fichiers vers le dossier final
const moveFilesToFinalDestination = (files, hotelId) => {
    const finalDir = path.join(__dirname, `../public/uploads/${hotelId}`);

    // Créer le dossier final s'il n'existe pas
    if (!fs.existsSync(finalDir)) {
        fs.mkdirSync(finalDir, { recursive: true });
    }

    const newPaths = [];

    // Déplacer chaque fichier
    files.forEach(file => {
        const newPath = path.join(finalDir, path.basename(file.path) + "." + file.originalname.split('.')[1]);
        fs.renameSync(file.path, newPath);
        newPaths.push(newPath);
    });

    return newPaths;
};

const GetPictureList = (hotels : IHotel[]) => {
    return hotels.map(hotel => {
        hotel = hotel.toObject();
            hotel.picture_list = []; // Initialiser picture_list
            const finalDir = path.join(__dirname, `../public/uploads/${hotel._id}`);
            if (fs.existsSync(finalDir)) {
                const files = fs.readdirSync(finalDir);
                for (const file of files) {
                    hotel.picture_list.push(`/public/${hotel._id}/${file}`);
                }
            }
            return hotel;
    });
}

//#endregion

export const Create = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotel: IHotel = req.body;
        
        if(await hotelRepository.findHotelByName(hotel.name as string)) {
            res.status(400).json({ error: "Un hôtel avec ce nom existe déjà" });
            return;
        }
        
        let uploadedFiles = [];
        // Récupérer les fichiers selon la configuration multer utilisée
        if (req.files && Array.isArray(req.files)) {
            uploadedFiles = req.files;
        } else if (req.files) {
            // Pour upload.fields
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            Object.keys(files).forEach(field => {
                uploadedFiles = [...uploadedFiles, ...files[field]];
            });
        } else if (req.file) {
            uploadedFiles = [req.file];
        }

        // Créer d'abord l'hôtel pour obtenir son ID
        const newHotel = await hotelRepository.createHotel(hotel);
        let finalPaths = [];
        // Si nous avons des fichiers, les déplacer vers le dossier final
        if (uploadedFiles.length > 0 && newHotel._id) {
            finalPaths = moveFilesToFinalDestination(uploadedFiles, newHotel._id);
        }

        res.status(201).json({ newHotel, picture_list: finalPaths });
    } catch (error) {
        console.error("Error creating hotel:", error);

        // Si une erreur survient, essayer de supprimer les fichiers temporaires
        if (req.file) {
            fs.unlinkSync(req.file.path);
        } else if (req.files) {
            if (Array.isArray(req.files)) {
                req.files.forEach(file => fs.unlinkSync(file.path));
            } else {
                // Pour upload.fields
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                Object.keys(files).forEach(field => {
                    files[field].forEach(file => fs.unlinkSync(file.path));
                });
            }
        }

        res.status(500).json({ error: "Failed to create hotel" });
    }
};



export const GetAll = async (req: Request, res: Response): Promise<void> => {

    const { limit } = req.query;
    try {

        const limitNum = limit ? parseInt(limit as string, 10) : 10;

        if (limitNum && limitNum <= 0) {
            res.status(400).json({ error: "La limite doit être supérieure à 0" });
            return;
        }

        const hotels = await hotelRepository.getHotels(limitNum);

        res.status(200).json(GetPictureList(hotels));
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ error: "Failed to retrieve hotels" });
    }
}