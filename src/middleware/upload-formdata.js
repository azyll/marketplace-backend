import formidable from 'formidable';
import fs from 'fs';
import supabase from '../lib/supabase.js';

/**
 * @param {'products' | 'avatars'} bucketName
 */
export const uploadFormData = (bucketName, options = {}) => {
  const {upsert = false} = options;
  return async (req, res, next) => {
    const form = formidable({maxFiles: 1, keepExtensions: true});

    form.parse(req, async (err, fields, files) => {
      if (err) return next(err);

      const transformedFields = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v[0]]));

      const image = files.image?.[0];
      if (!image) {
        req.body = transformedFields;
        return next(); // No image uploaded
      }

      const fileBuffer = fs.readFileSync(image.filepath);
      const fileExt = image.originalFilename.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${bucketName}/${fileName}`;

      const {error: uploadError} = await supabase.storage
        .from('product-images')
        .upload(`products/${fileName}`, fileBuffer, {
          contentType: image.mimetype,
          upsert
        });

      if (uploadError) return next(uploadError);

      req.body = {
        ...transformedFields,
        image: `products/${fileName}`
      };

      next();
    });
  };
};
