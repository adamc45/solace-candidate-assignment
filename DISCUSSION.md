```Specialties Column```
This is a perfect example of what not to do. This would ideally separated into two new tables:
1) specialities: This would contain a list of all specalities that an advocate can have
2) advocate_specialities: This table would contain 2 columns `specialty_id` and `advocate_id` which could then be used to do a join to aggregate the necessary data. This would fix the gnarly (and slow) query that now exists to try to determine if there are any matching specialities.

```Loading State```
Right now I have the loading state behind a boolean check. Ideally, I'd add a spinner as well to give the user the impression something is happening.

```Codebase```
All the React code I added was jammed into the page.tsx. Ideally, this would be separated out more to allow for code reuse.

```Database```
The columns for the dropdown would ideally be stored in the database as well. This would allow us to theoretically make a change to the production database in an emergency situation without having to push out a new deployment.

Some other considerations are that there is no uniqueness check right now. Phone number could probably be used as that since only one person owns a phone number. Other possibilities include email, or some form of goverment identification.

There should also be pagination included at some point. There is no reason to fetch every row in the database that matches the query params.

```Query Results```
Does an empty data set count as an error? I've worked at 2 companies now. My latest employer treated empty data sets like errors. My first didn't. I can see arguments for both.

```Testing```
This was meant to be a short takehome assessment so no tests have been included. This would be a hard requirement in the real world.

```Final Thoughts```
I set up this project to work with a real database.