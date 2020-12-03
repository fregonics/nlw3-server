import { Request, response, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/Orphanages_view'
import * as Yup from 'yup';

export default {
    async index(req: Request, res: Response) {
        const orphanagesRepo = getRepository(Orphanage)
        const orphanages = await orphanagesRepo.find({
            relations: ["images"]
        })
        return res.json(orphanageView.renderMany(orphanages))
    },

    async show(req: Request, res: Response) {
        const { id } = req.params;

        const orphanagesRepo = getRepository(Orphanage)
        const orphanages = await orphanagesRepo.findOneOrFail(id, {
            relations: ["images"]
        })
        return res.json(orphanageView.render(orphanages))
    },

    async create(req: Request, res: Response) {
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            openning_hours,
            open_on_weekends
        } = req.body
    
        const requestImages = req.files as Express.Multer.File[]
        const images = requestImages.map((img) => {
            return { path: img.filename }
        })

        const orphanagesRepo = getRepository(Orphanage)
        
        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            openning_hours,
            open_on_weekends: (open_on_weekends === 'true'),
            images
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            openning_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required()
            }))
        })

        await schema.validate(data, {
            abortEarly: false
        })
        
        const orphanage = orphanagesRepo.create(data)
    
        await orphanagesRepo.save(orphanage)
    
    
        return res.status(201)
                  .json(orphanage)
    }
}