import { supabase } from "./supabase";

const API_BASE_URL = "http://localhost:3000";

const encodePath = (path: string) =>
  path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

export const resolveImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl) return "";

  const normalized = imageUrl
    .trim()
    .replace(/^['\"]+|['\"]+$/g, "")
    .replace(/\\/g, "/");
  if (!normalized) return "";

  const lowered = normalized.toLowerCase();
  if (lowered === "null" || lowered === "undefined" || lowered === "nan") {
    return "";
  }

  // Some persisted values can come as JSON strings like {"publicUrl":"..."}.
  if (normalized.startsWith("{") && normalized.endsWith("}")) {
    try {
      const parsed = JSON.parse(normalized);
      const candidate =
        parsed?.publicUrl || parsed?.url || parsed?.path || parsed?.imageUrl;
      if (typeof candidate === "string") {
        return resolveImageUrl(candidate);
      }
    } catch {
      // Ignore parse errors and continue with other resolution rules.
    }
  }

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:")
  ) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const normalizedHttp = normalized
      .replace("/storage/storage/", "/storage/")
      .replace("//storage/v1", "/storage/v1");

    if (supabaseUrl && normalizedHttp.includes("/storage/v1/object/public/")) {
      try {
        const source = new URL(normalizedHttp);
        const target = new URL(supabaseUrl);
        if (source.host !== target.host) {
          return encodeURI(`${target.origin}${source.pathname}${source.search}${source.hash}`);
        }
      } catch {
        // Keep normalized absolute URL when parsing fails.
      }
    }

    return encodeURI(normalizedHttp);
  }

  if (normalized.startsWith("//")) {
    return `https:${normalized}`;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (normalized.startsWith("/storage/")) {
    if (supabaseUrl) {
      return `${supabaseUrl}${normalized}`;
    }
    return `${API_BASE_URL}${normalized}`;
  }

  if (normalized.startsWith("storage/")) {
    if (supabaseUrl) {
      return `${supabaseUrl}/${normalized}`;
    }
    return `${API_BASE_URL}/${normalized}`;
  }

  if (normalized.startsWith("v1/object/public/")) {
    if (supabaseUrl) {
      return `${supabaseUrl}/${normalized}`;
    }
    return `${API_BASE_URL}/storage/${normalized}`;
  }

  if (normalized.startsWith("object/public/")) {
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/${normalized}`;
    }
    return `${API_BASE_URL}/storage/v1/${normalized}`;
  }

  if (normalized.startsWith("/")) {
    return `${API_BASE_URL}${normalized}`;
  }

  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/documents/${encodePath(normalized)}`;
  }

  return `${API_BASE_URL}/${normalized}`;
};

export const uploadImageToSupabase = async (
  file: File,
  folder: string,
  fileName?: string
): Promise<string | null> => {
  try {
    // Generar un nombre único si no se proporciona
    const uniqueName =
      fileName ||
      `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;
    const filePath = `${folder}/${uniqueName}`;

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }

    // Obtener URL pública del archivo
    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadImageToSupabase:", error);
    return null;
  }
};

export const deleteImageFromSupabase = async (
  filePath: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.from("documents").remove([filePath]);

    if (error) {
      console.error("Error deleting file:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteImageFromSupabase:", error);
    return false;
  }
};

export const deleteImageByPublicUrl = async (
  imageUrl: string,
  bucketName: string = "documents"
): Promise<boolean> => {
  try {
    if (!imageUrl) return true;

    const marker = `/storage/v1/object/public/${bucketName}/`;
    const markerIndex = imageUrl.indexOf(marker);
    if (markerIndex === -1) {
      console.error("Could not resolve storage path from URL:", imageUrl);
      return false;
    }

    const encodedPath = imageUrl.slice(markerIndex + marker.length);
    const filePath = decodeURIComponent(encodedPath);

    return deleteImageFromSupabase(filePath);
  } catch (error) {
    console.error("Error in deleteImageByPublicUrl:", error);
    return false;
  }
};
