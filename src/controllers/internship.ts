import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { AppDataSource } from "../db/data_source";
import Joi from "joi";
import { Internship } from "../entity/Internship";
import { User } from "../entity/User";

const internshipSchema = Joi.object({
  joinedDate: Joi.date().required(),
  completionDate: Joi.date().required(),
  isCertified: Joi.boolean().required(),
  mentorName: Joi.string().min(3).max(30).required(),
  user: Joi.number().integer().required(),
});

//Create new internship
export const createInternship = async (req: Request, res: Response) => {
  const { error } = internshipSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const internshipRepo = AppDataSource.getRepository(Internship);
  const userRepo = AppDataSource.getRepository(User);
  const {
    joinedDate,
    completionDate,
    isCertified,
    mentorName,
    user,
  }: Internship = req.body;

  const userEntity = await userRepo.findOne({ where: { id: user.id } });

  if (!userEntity) {
    return res.status(404).json({ message: "User not found" });
  }

  const newInternship = internshipRepo.create({
    joinedDate,
    completionDate,
    isCertified,
    mentorName,
    user: userEntity,
  });

  await internshipRepo.save(newInternship);

  return res.status(201).json({ "Internship created:": newInternship });
};

//Get all internships
export const getInternships = (req: Request, res: Response) => {
  const internshipRepository = AppDataSource.getRepository(Internship);
  return internshipRepository.find().then((internships) => {
    return res.status(200).json(internships);
  });
};

//Get internship by ID
export const getInternshipByID = async (req: Request, res: Response) => {
  const internshipRepository = AppDataSource.getRepository(Internship);
  const id = parseInt(req.params.id);
  const internship = await internshipRepository.findOne({ where: { id } });
  if (!internship) {
    return res.status(404).json({ message: "Internship not found" });
  }
  return res.status(200).json(internship);
};

//Update an existing internship
export const updateInternship = async (req: Request, res: Response) => {
  const { error } = internshipSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const internshipRepository = AppDataSource.getRepository(Internship);
  const userRepo = AppDataSource.getRepository(User);
  const internship = await internshipRepository.findOneById(req.params.id);
  if (internship) {
    const {
      joinedDate,
      completionDate,
      isCertified,
      mentorName,
      user,
    }: Internship = req.body;

    const userEntity = await userRepo.findOne({ where: { id: user.id } });

    if (!userEntity) {
      return res.status(404).json({ message: "User not found" });
    }

    internshipRepository.merge(internship, {
      joinedDate,
      completionDate,
      isCertified,
      mentorName,
      user: userEntity,
    });
    const result = await internshipRepository.save(internship);
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "Internship not found" });
  }
};
