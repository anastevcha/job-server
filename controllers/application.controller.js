import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        // есть ли уже отклик
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "Вы уже откликнулись на эту вакансию",
                success: false
            });
        }

        // существует ли вакансия
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Вакансия не найдена",
                success: false
            });
        }

        
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        // добавление отклика в массив вакансии
        job.applications.push(newApplication._id);
        await job.save();

        
        const updatedJob = await Job.findById(jobId).populate("applications");

        return res.status(201).json({
            message: "Отклик успешно подан",
            success: true,
            job: updatedJob // отправляем клиенту обновлённую вакансию
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Ошибка сервера",
            success: false
        });
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"Нет отклика",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Вакансия не найдена',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'Требуется статус',
                success:false
            })
        };

        
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Отклик не найден",
                success:false
            })
        };

        // обновление статуса
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Статус успешно обновлен.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}