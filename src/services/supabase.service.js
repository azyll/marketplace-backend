import supabase from '../lib/supabase.js';

export class SupabaseService {
  /**
   * @param {File} image
   * @param {string} fileName
   */
  static async uploadFile(image, fileName) {
    const {data, error} = await supabase.storage.from('product-images').upload(fileName, image);
    if (error) {
      console.log(error, 'file upload error');
      // Handle error
    } else {
      console.log(data, 'file upload data');
      // Handle success
    }
  }
}
