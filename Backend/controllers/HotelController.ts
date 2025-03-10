import { Request, Response, NextFunction } from 'express';
import HotelRepository from '../repositories/hotelRepository.ts';
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

const tempStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = path.join(__dirname, '/public/uploads/temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}.${file.mimetype.split('/')[1]}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Seules les images sont autorisées!'), false);
    }
};

export const upload = multer({
    storage: tempStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

const moveFilesToFinalDestination = (files, hotelId) => {
    const finalDir = path.join(__dirname, `../public/uploads/${hotelId}`);

    if (!fs.existsSync(finalDir)) {
        fs.mkdirSync(finalDir, { recursive: true });
    }

    const newPaths = [];

    files.forEach(file => {
        const newPath = path.join(finalDir, path.basename(file.path) + "." + file.originalname.split('.')[1]);
        fs.renameSync(file.path, newPath);
        newPaths.push(newPath);
    });

    return newPaths;
};

const GetPictureList = (hotels: IHotel[]) => {
    return hotels.map(hotel => {
        hotel = hotel.toObject();
        hotel.picture_list = [];
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

        if (await hotelRepository.findHotelByName(hotel.name as string)) {
            res.status(400).json({ error: "Un hôtel avec ce nom existe déjà" });
            return;
        }

        let uploadedFiles = [];
        if (req.files && Array.isArray(req.files)) {
            uploadedFiles = req.files;
        } else if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            Object.keys(files).forEach(field => {
                uploadedFiles = [...uploadedFiles, ...files[field]];
            });
        } else if (req.file) {
            uploadedFiles = [req.file];
        }

        const newHotel = await hotelRepository.createHotel(hotel);
        let finalPaths = [];
        if (uploadedFiles.length > 0 && newHotel._id) {
            finalPaths = moveFilesToFinalDestination(uploadedFiles, newHotel._id);
        }


        res.status(201).json(GetPictureList([newHotel]));
    } catch (error) {
        console.error("Error creating hotel:", error);

        if (req.file) {
            fs.unlinkSync(req.file.path);
        } else if (req.files) {
            if (Array.isArray(req.files)) {
                req.files.forEach(file => fs.unlinkSync(file.path));
            } else {
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
    const { limit, page, location, startDate, endDate } = req.query;
    try {
        const limitNum = limit ? parseInt(limit as string, 10) : 10;
        const pageNumber = page ? parseInt(page as string, 10) : 0;
        if (startDate && typeof startDate !== 'string') {
            res.status(400).json({ error: "La date de début doit être une chaîne de caractères, format YYYY-MM-DD" });
            return;
        }
        if (endDate && typeof endDate !== 'string') {
            res.status(400).json({ error: "La date de fin doit être une chaîne de caractères, format YYYY-MM-DD" });
            return;
        }

        if(startDate && endDate && new Date(startDate as string) > new Date(endDate as string)) {
            res.status(400).json({ error: "La date de début doit être antérieure à la date de fin" });
            return;
        }

        if (location && typeof location !== 'string') {
            res.status(400).json({ error: "L'emplacement doit être une chaîne de caractères" });
            return;
        }

        if (limitNum && limitNum <= 0) {
            res.status(400).json({ error: "La limite doit être supérieure à 0" });
            return;
        }

        const hotels = await hotelRepository.getHotels(limitNum, pageNumber, location as string, startDate as string, endDate as string);

        res.status(200).json(GetPictureList(hotels));
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ error: "Failed to retrieve hotels" });
    }
}

export const UploadFileForHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotelId = req.params.id;
        if (!hotelId) {
            res.status(400).json({ error: "ID de l'hôtel est obligatoire" });
            return;
        }
        let uploadedFiles = [];
        if (req.files && Array.isArray(req.files)) {
            uploadedFiles = req.files;
        } else if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            Object.keys(files).forEach(field => {
                uploadedFiles = [...uploadedFiles, ...files[field]];
            });
        } else if (req.file) {
            uploadedFiles = [req.file];
        }

        const finalPaths = moveFilesToFinalDestination(uploadedFiles, hotelId);
        res.status(201).json(uploadedFiles.map(path => `/public/${path.filename}.${path.originalname.split('.')[1]}`));
    } catch (error) {
        console.error("Erreur lors de l'upload du fichier pour l'hôtel:", error);

        if (req.file) {
            fs.unlinkSync(req.file.path);
        } else if (req.files) {
            if (Array.isArray(req.files)) {
                req.files.forEach(file => fs.unlinkSync(file.path));
            } else {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                Object.keys(files).forEach(field => {
                    files[field].forEach(file => fs.unlinkSync(file.path));
                });
            }
        }

        res.status(500).json({ error: "Erreur lors de l'upload du fichier pour l'hôtel" });
    }
}

export const DeleteHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotelId = req.params.id;
        if (!hotelId) {
            res.status(400).json({ error: "ID de l'hôtel est obligatoire" });
            return;
        }

        const hotel = await hotelRepository.deleteHotel(hotelId);
        if (!hotel) {
            res.status(404).json({ error: "Hôtel non trouvé" });
            return;
        }

        const finalDir = path.join(__dirname, `../public/uploads/${hotelId}`);
        if (fs.existsSync(finalDir)) {
            fs.rmdirSync(finalDir, { recursive: true });
        }

        res.status(200).json({ message: "Hôtel supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'hôtel:", error);
        res.status(500).json({ error: "Erreur lors de la suppression de l'hôtel" });
    }
}

export const DeleteFile = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotelId = req.params.hotelId;
        const fileId = req.params.fileId;
        if (!hotelId || !fileId) {
            res.status(400).json({ error: "ID de l'hôtel et du fichier sont obligatoires" });
            return;
        }

        const finalDir = path.join(__dirname, `../public/uploads/${hotelId}`);
        if (fs.existsSync(finalDir)) {
            const files = fs.readdirSync(finalDir);
            for (const file of files) {
                const filePath = path.join(finalDir, file);
                if (filePath.endsWith(fileId)) {
                    fs.unlinkSync(filePath);
                    res.status(200).json({ message: "Fichier supprimé avec succès" });
                    return;
                }
            }
        }

        res.status(404).json({ error: "Fichier non trouvé" });
    } catch (error) {
        console.error("Erreur lors de la suppression du fichier:", error);
        res.status(500).json({ error: "Erreur lors de la suppression du fichier" });
    }
}

export const UpdateHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotelId = req.params.id;
        const hotel = req.body;
        if (!hotelId) {
            res.status(400).json({ error: "ID de l'hôtel est obligatoire" });
            return;
        }

        const hotelToUpdate = await hotelRepository.findHotelById(hotelId);
        if (!hotelToUpdate) {
            res.status(404).json({ error: "Hôtel non trouvé" });
            return;
        }

        const hotelUpdate = await hotelRepository.updateHotel(hotelId, hotel);

        res.status(200).json({hotel: GetPictureList([hotelUpdate]), message: "Hôtel modifié avec succès" });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'hôtel:", error);
        res.status(500).json({ error: "Erreur lors de la récupération de l'hôtel" });
    }
}

export const GetHotelById = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotelId = req.params.id;
        if (!hotelId) {
            res.status(400).json({ error: "ID de l'hôtel est obligatoire" });
            return;
        }

        const hotel = await hotelRepository.findHotelById(hotelId);
        if (!hotel) {
            res.status(404).json({ error: "Hôtel non trouvé" });
            return;
        }

        res.status(200).json(GetPictureList([hotel]));
    } catch (error) {
        console.error("Erreur lors de la récupération de l'hôtel:", error);
        res.status(500).json({ error: "Erreur lors de la récupération de l'hôtel" });
    }
}