import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Требуется указать название компании",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "Вы не можете регистрировать уже существующую компанию",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Компания успешно зарегистрирована",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; 
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Компании не найдены",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {

    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Компании не найдены",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        
        let logo = req.body.logo; // оставляем текущий логотип по умолчанию
        if (req.file) {
            const file = getDataUri(req.file); 
            const cloudResponse = await cloudinary.uploader.upload(file.content);
            logo = cloudResponse.secure_url;
        }

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { name, description, website, location, logo },
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "Компания не найдена",
                success: false
            });
        }

        return res.status(200).json({
            message: "Информация компании обновлена",
            success: true,
            company
        });

    } catch (error) {
        console.error("Ошибка при обновлении компании:", error);
        return res.status(500).json({
            message: "Ошибка сервера",
            success: false
        });
    }
};
 export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const company = await Company.findByIdAndDelete(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Компания не найдена"
            });
        }

        res.json({
            success: true,
            message: "Компания успешно удалена"
        });

    } catch (error) {
        console.error("Ошибка при удалении компании:", error);
        res.status(500).json({
            success: false,
            message: "Не удалось удалить компанию",
            error: error.message
        });
    }
};