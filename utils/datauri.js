import DataUriParser from "datauri/parser.js"

import path from "path";

const getDataUri = (file) => {
    if (!file || !file.originalname || !file.buffer) {
        throw new Error("Файл должен содержать originalname и buffer");
    }

    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString(); // .jpg, .png и т.д.
    return parser.format(extName, file.buffer);
};

export default getDataUri;