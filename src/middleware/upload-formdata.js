/**
 *
 * @param {'products' | 'avatars'} uploadPath - Image Path ./upload/images/
 */
import formidable from 'formidable';

export const uploadFormData = (uploadPath) => {
  return async (req, res, next) => {
    const form = formidable({
      keepExtensions: true,
      uploadDir: `./uploads/images/${uploadPath}`,
      maxFiles: 1,
      maxFieldsSize: 5 * 1024 * 1024,
      filter: function ({name, originalFilename, mimetype}) {
        // Accept only images
        return mimetype && mimetype.includes('image');
      },
      filename: function (name, ext, part, form) {
        return `${Date.now()}-${form.fields.name[0]}.${part.originalFilename.split('.')[1]}`;
      }
    });

    await form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
      }
      const transformedFields = Object.keys(fields).reduce((acc, key) => {
        acc[key] = fields[key][0]; // Take the first value from the array
        return acc;
      }, {});
      if (files.image && files.image[0]) {
        transformedFields.image = files.image[0].newFilename;
      }

      req.body = transformedFields;
      next();
    });
  };
};
