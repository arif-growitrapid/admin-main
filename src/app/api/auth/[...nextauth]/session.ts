import config from "@/config";
import clientPromise from "@/db/db";
import { AuthType, DBAuthType, PermissionsType, roleType } from "@/types/auth";
import { operator_permissions, user_permissions } from "@/types/permissions";
import { Session, DefaultSession, Awaitable } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

const forced_operators = [
    "as2048282@gmail.com",
    "arifsardar.private@gmail.com",
    "bishal.nandi@growitrapid.com",
    "nandibishal97@yahoo.in",
    "nandibishal04@gmail.com",
    "qa.sixsigma@gmail.com"
];

export default async function sessionHandler(params: {
    session: Session;
    token: JWT;
    user: AdapterUser;
} & {
    newSession: any;
    trigger: "update";
}) {

    const { session, token, user, newSession, trigger } = params;
    const user_data = user as DBAuthType;

    try {
        if (session?.user) {

            // If the session is being updated, update the session object
            // Add all the user data to the session object
            session.user = {
                ...session.user,
                ...user_data as AuthType,
            }

            // If roles is not an array, then make it an array
            if (!Array.isArray(session.user.roles)) {
                session.user.roles = [];
            }

            // If the user is in the forced_operators list, add the operator role to them
            // if they don't already have it.
            if (forced_operators.includes(user_data?.email) && !session.user.roles.includes("operator")) {
                session.user.roles.push("operator");
            }

            // add permissions to the session object
            // connect to the database
            const client = await clientPromise;
            const db = client.db(config.db.root_name);
            const roles_collection = db.collection<roleType>("roles");
            let permissions: PermissionsType = {};

            // add user permissions to permissions object
            user_permissions.forEach((permission) => {
                permissions[permission] = true;
            });

            // add operator permissions to permissions object
            // if the user is an operator
            // an operator will have all the permissions so, if the user is an operator
            // then serch fore roles is unnecessary
            if (session.user.roles.includes("operator")) {
                operator_permissions.forEach((permission) => {
                    permissions[permission] = true;
                });
            } else {
                // If the user is not an operator, add the permissions from the roles
                // Match the roles of the user with the roles in the roles collection
                // and add the permissions to the permissions object if it doesn't already exist
                const user_roles = session.user.roles;
                const roles = await roles_collection.find({ name: { $in: user_roles } }).toArray();
                roles.forEach((role) => {
                    role.permissions.forEach((permission) => {
                        if (!permissions[permission]) {
                            permissions[permission] = true;
                        }
                    })
                });
            }

            // Add the permissions to the session object
            session.user.permissions = permissions;
        }

        // Return the mutated session object
        return session;

    } catch (err) {
        console.error(err);
        return session;
    }
}
