import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return Response.json(
      { error: "Supabase configuration is missing" },
      { status: 500 },
    );
  }

  try {
    // Verify the existing admin access token.
    const token = request.headers
      .get("authorization")
      ?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!authResponse.ok) {
      return Response.json(
        { error: "Invalid or expired session" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return Response.json(
        { error: "Please select an image" },
        { status: 400 },
      );
    }

    const extension = ALLOWED_TYPES[file.type];

    if (!extension) {
      return Response.json(
        { error: "Only JPG, PNG and WEBP images are allowed" },
        { status: 400 },
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "Image must be between 1 byte and 5 MB" },
        { status: 400 },
      );
    }

    const filePath = `uploads/${randomUUID()}.${extension}`;

    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/portfolio-images/${filePath}`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": file.type,
          "x-upsert": "false",
        },
        body: await file.arrayBuffer(),
      },
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();

      console.error("Supabase image upload failed:", error);

      return Response.json(
        { error: "Image upload failed. Check Storage permissions." },
        { status: uploadResponse.status },
      );
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/portfolio-images/${filePath}`;

    return Response.json({
      success: true,
      path: filePath,
      url: publicUrl,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return Response.json({ error: "Unable to upload image" }, { status: 500 });
  }
}
