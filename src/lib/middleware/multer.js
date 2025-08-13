import multer from 'multer';

const upload = multer({ dest: './upload/' }); // temp folder
export default upload;
