
import { getSupabaseClient, isSupabaseConnected } from './supabaseClient';

/**
 * Uploads a document to Supabase storage
 * @param file The file to upload
 * @param folder The folder path within the bucket
 * @param fileName Custom filename (optional)
 * @returns Object containing success status, file URL, and error if any
 */
export const uploadDocument = async (
  file: File, 
  folder: string,
  fileName?: string
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> => {
  if (!isSupabaseConnected()) {
    console.warn("Supabase not connected. Cannot upload file.");
    return { 
      success: false, 
      error: 'Supabase connection not available' 
    };
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { 
        success: false, 
        error: 'Supabase client not available' 
      };
    }

    // Generate a unique file name if not provided
    const fileExt = file.name.split('.').pop();
    const actualFileName = fileName || `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${actualFileName}` : actualFileName;

    // Upload file to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('application-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase
      .storage
      .from('application-documents')
      .getPublicUrl(data.path);

    return { 
      success: true, 
      url: publicUrlData.publicUrl,
      path: data.path
    };
  } catch (e) {
    const error = e as Error;
    console.error('Unexpected error uploading document:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Deletes a file from Supabase storage
 * @param filePath The path of the file to delete
 * @returns Object containing success status and error if any
 */
export const deleteDocument = async (
  filePath: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConnected()) {
    console.warn("Supabase not connected. Cannot delete file.");
    return { 
      success: false, 
      error: 'Supabase connection not available' 
    };
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { 
        success: false, 
        error: 'Supabase client not available' 
      };
    }

    const { error } = await supabase
      .storage
      .from('application-documents')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { success: true };
  } catch (e) {
    const error = e as Error;
    console.error('Unexpected error deleting document:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};
