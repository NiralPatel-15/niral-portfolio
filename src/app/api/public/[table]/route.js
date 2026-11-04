export async function GET(request, { params }) {
  const { table } = await params;
  const query = request.nextUrl.search || "";

  const allowedTables = [
    "hero",
    "about",
    "education",
    "experience",
    "skill_categories",
    "projects",
    "contact",
  ];

  if (!allowedTables.includes(table)) {
    return Response.json({ error: "Invalid table" }, { status: 400 });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return Response.json(
      { error: "Supabase environment variables are missing" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/${table}${query}`,
      {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return Response.json(
        { error: data.message || data.details || "Supabase request failed" },
        { status: res.status },
      );
    }

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Unable to connect to Supabase" },
      { status: 500 },
    );
  }
}
