export async function GET() {
	if (!process.env.DATABASE_URL) {
    return Response.error("DATABASE_URL is not set");
  }
	const data = [
		{
			id: 1,
			value: 'First Name'
		},
		{
			id: 2,
			value: 'Last Name'
		},
		{
			id: 3,
			value: 'City'
		},
		{
			id: 4,
			value: 'Degree'
		},
		{
			id: 5,
			value: 'Specialties'
		},
		{
			id: 6,
			value: 'Years of Experience'
		}
	];
	return Response.json({ data });
}
