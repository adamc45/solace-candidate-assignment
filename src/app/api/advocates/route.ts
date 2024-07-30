import { eq, ilike, sql } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

async function getDefaultData() {
	return await db.select().from(advocates);
}

const firstNameFilter = async (term) => {
	return db
		.select()
		.from(advocates)
		.where(
			ilike(advocates.firstName, `%${term}%`)
		);
};

const lastNameFilter = async (term) => {
	return db
		.select()
		.from(advocates)
		.where(
			ilike(advocates.lastName, `%${term}%`)
		);
};

const cityFilter = async (term) => {
	return db
		.select()
		.from(advocates)
		.where(
			ilike(advocates.city, `%${term}%`)
		);
};

const degreeFilter = async (term) => {
	return db
		.select()
		.from(advocates)
		.where(
			ilike(advocates.degree, `%${term}%`)
		);
}

const specialitiesFilter = async (term) => {
	const expression = `%${term}%`;
	return await db
		.select()
		.from(advocates)
		.where(
			sql`exists
				(
					select 1
					FROM jsonb_array_elements_text(
						jsonb_build_array(payload)
					) AS p
					WHERE p ILIKE ${expression}
				)`
		);
};

const yearsOfExperienceFilter = async (term) => {
	if (isNaN(+term)) {
		return getDefaultData();
	}
	return db
		.select()
		.from(advocates)
		.where(
			eq(advocates.yearsOfExperience, `${+term}`)
		);
}

const filters = new Map(
	[
		[1, firstNameFilter],
		[2, lastNameFilter],
		[3, cityFilter],
		[4, degreeFilter],
		[5, specialitiesFilter],
		[6, yearsOfExperienceFilter]
	]
);

export async function GET(t) {
	if (!process.env.DATABASE_URL) {
    return Response.error("DATABASE_URL is not set");
  }
	const searchTerm = t.nextUrl.searchParams.get('searchTerm');
	const id = t.nextUrl.searchParams.get('id');
	// No filtering to apply
	if (searchTerm === '' || id === 0) {
		const data = await getDefaultData();
		return Response.json({ data });
	}
	// Some filter is being passed up we don't yet know how to handle. Treat it like no filtering is to occur.
	const filter = filters.get(+id);
	if (filter === undefined) {
		const data = await getDefaultData();
		return Response.json({ data });
	}
	const data = await filter(searchTerm);
	return Response.json({ data });
}
