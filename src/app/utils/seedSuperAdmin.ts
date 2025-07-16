import bcryptjs from 'bcryptjs';
import { envVars } from "../config/env"
import { IAuthProvider, IUser, Role } from "../module/user/user.interface";
import { User } from "../module/user/user.model"

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

        if (isSuperAdminExist) {
            console.log("Super admin already exists");
            return
        }

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, parseInt(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const payload: Partial<IUser> = {
            name: "Super admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            role: Role.SUPER_ADMIN,
            auths: [authProvider]
        }

        const superAdmin = await User.create(payload);

        console.log(superAdmin);
        console.log('Super admin created successfully.');

    } catch (error) {
        console.log(error);
    }

}