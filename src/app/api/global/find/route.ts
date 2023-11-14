import { searchForUser } from "@/functions/user";


export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            query,
            usersOnly,
            postsOnly,
            limit = 10,
        } = body as {
            query: string;
            usersOnly?: boolean;
            postsOnly?: boolean;
            limit?: number;
        };

        let results: any[] = [];

        if (usersOnly) {
            const users = (await searchForUser(query, limit)).data || [];

            results.concat(users);
        } else if (postsOnly) {
            // results = await global.findPosts(query, limit);
        } else {
            // results = await global.find(query, limit);
        }

        return Response.json({
            results,
        });
    } catch (error) {}
}
