/**
 * This script is used to setup the database with some mock data
 * It is used for development purposes only; Strictly prohibited to use in production
 * 
 * This script is called by the npm script "setup-db" with environment variable "MONGODB_URI"
 * Command: $env:MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.bpoiuyt.mongodb.net/?retryWrites=true&w=majority"
 *          npm run setup-db
 * 
 * Developed bt @NeuroNexul / Arif Sardar
 * @license MIT
 */

import clientPromise from "../src/db/db";
import { MongoClient, ObjectId } from "mongodb";
import { faker } from '@faker-js/faker';
import { AuthType } from "../src/types/auth";
import { DBBlogPostType } from "@/types/blog";
import { MinifyAuth } from "../src/functions/minify_auth";

const db = {
    auth_name: "auth",
    root_name: "root",
    blog_name: "blog",
    static_db_name: "static_db",
    default_document_collection_name: "default_document_collection",
}

export default async function setup_db() {
    try {
        console.log(">>===> Setting up database");
        console.log(`>>===> Connecting to MongoDB; URI: ${process.env.MONGODB_URI}`);

        // Connect to MongoDB & Get the client
        const client = (await clientPromise);

        // Create the collections if they don't exist
        // auth db is usually managed by next-auth
        // Only have to create some users
        const mock_users: AuthType[] = Array.from({ length: 10 }, () => {
            const id = new ObjectId();

            return {
                _id: id,
                id: id.toHexString(),
                roles: ["user"],
                is_employee: false,
                status: ["active", "inactive", "blocked", "pending"][Math.floor(Math.random() * 4)],
                createdAt: faker.date.past(),

                name: faker.person.fullName(),
                email: faker.internet.email(),
                image: faker.image.avatar(),
                bio: faker.lorem.paragraph(),
                emailVerified: faker.date.past(),

                dob: faker.date.birthdate(),
                gender: ['male', 'female', 'other', 'not-specified'][Math.floor(Math.random() * 4)],
                phone: {
                    countryCode: faker.location.countryCode(),
                    number: faker.phone.number(),
                    verified: true,
                },
                extraEmails: [faker.internet.email()],
                extraPhones: [{
                    countryCode: faker.location.countryCode(),
                    number: faker.phone.number(),
                    verified: true,
                }],
                addresses: [{
                    addressLine1: faker.location.streetAddress(),
                    addressLine2: faker.location.secondaryAddress(),
                    city: faker.location.city(),
                    country: faker.location.country(),
                    state: faker.location.state(),
                    zipCode: faker.location.zipCode(),
                }],
                socialProfiles: [{
                    name: "facebook",
                    url: faker.internet.url(),
                }],
                savedContent: [],

                permissions: {},

                isFake: true,
            } as AuthType;
        });
        await create_collection(client, db.auth_name, "users", mock_users);

        // Create Root Collections if they don't exist
        // (roles)
        await create_collection(client, db.root_name, "roles", []);

        // Create Blog Collections if they don't exist
        // (posts, categories, tags)
        const mock_posts = Array.from(mock_users, (user) => {

            return Array.from({ length: Math.floor(Math.random() * 10) }, () => {
                const id = new ObjectId();

                return {
                    _id: id,
                    title: faker.lorem.sentence(),
                    slug: faker.lorem.slug(),
                    is_published: true,
                    content: faker.lorem.paragraphs(),
                    excerpt: faker.lorem.paragraph(),
                    thumbnail: faker.image.url(),
                    time_to_read: Math.floor(Math.random() * 10),
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.past(),

                    author: MinifyAuth(user),
                    tags: Array.from({ length: Math.floor(Math.random() * 10) }, () => faker.lorem.slug()),
                    categories: Array.from({ length: Math.floor(Math.random() * 10) }, () => faker.lorem.slug()),
                    comments: [],

                    // For internal use
                    views: faker.number.int(),
                    likes: faker.number.int(),
                    saves: faker.number.int(),
                    viewed_by: [],
                    viewed_by_ip: [],
                    liked_by: [],
                    saved_by: [],

                    is_seo_compatabile: true,

                    isFake: true,
                } as DBBlogPostType;
            });
        });
        await create_collection(client, db.blog_name, "posts", mock_posts.flat(1));
        await create_collection(client, db.blog_name, "tags", []);
        await create_collection(client, db.blog_name, "categories", []);

        client.close();
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function create_collection(client: MongoClient, db_name: string, collection_name: string, data: Array<any>) {
    try {
        const db = client.db(db_name);
        const collection_exists = await db.listCollections({ name: collection_name }).hasNext();
        if (!collection_exists) {
            await db.createCollection(collection_name);
        }
        const collection = db.collection(collection_name);

        // Remove previous fake data
        await collection.deleteMany({ isFake: true });

        if (data && data.length > 0) {
            await collection.insertMany(data);
        }

        if (!collection_exists)
            console.log(`>>===> Created collection ${collection_name} in database ${db_name}`);
        else
            console.log(`>>===> Collection ${collection_name} already exists in database ${db_name}`);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// Run the script if called directly
if (require.main === module) {
    setup_db();
}
