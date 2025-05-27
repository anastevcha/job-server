import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

//админка
export const postJob = async (req, res) =>{
    try {
        const {title, description, requirements, salary, location, jobType, experience, position, companyId} = req.body;
        const userId = req.id;

        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message:"Что-то пропущено",
                success:false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message:"Новая вакансия успешно создана",
            job,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
//соиск
export const getAllJobs = async (req,res) =>{
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                {title:{$regex:keyword, $options:"i"}},
                {description:{$regex:keyword, $options:"i"}},
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if(!jobs){
            return res.status(404).json({
                message:"Вакансии не найдены",
                success:false
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
//соискатель
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("applications");

        if (!job) {
            return res.status(404).json({
                message: "Вакансия не найдена",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Ошибка сервера", success: false });
    }
};
//админка
export const getAdminJobs = async (req,res) =>{
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId}).populate({
            path:'company',
            createdAt:-1
        });
        if(!jobs){
            return res.status(404).json({
                message:"Вакансии не найдены",
                success:false
            })
        };
        return res.status(200).json({
            jobs,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
export const saveJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
                success: false,
            });
        }

        // Проверяем, есть ли уже эта вакансия в списке сохранённых
        if (user.savedJobs.includes(jobId)) {
            return res.status(400).json({
                message: "Вакансия уже сохранена",
                success: false,
            });
        }

        // Добавляем вакансию в список savedJobs
        user.savedJobs.push(jobId);
        await user.save();

        return res.status(200).json({
            message: "Вакансия успешно сохранена",
            success: true,
        });

    } catch (error) {
        console.error("Ошибка при сохранении вакансии:", error);
        return res.status(500).json({
            message: "Ошибка сервера",
            success: false,
        });
    }
};
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate({
            path: "savedJobs",
            populate: {
                path: "company"
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
                success: false
            });
        }

        return res.status(200).json({
            savedJobs: user.savedJobs,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Ошибка сервера",
            success: false
        });
    }
};