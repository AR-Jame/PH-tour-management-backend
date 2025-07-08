import dotenv from "dotenv"

dotenv.config();

interface EnvConfig {
    PORT: string,
    DB_URI: string,
    NODE_ENV: 'development' | 'production'
}

const loadEnvVariables = (): EnvConfig => {

    const requiredEvnVars: string[] = ['PORT', 'DB_URI', 'NODE_ENV']

    requiredEvnVars.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require env ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URI: process.env.DB_URI as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
    }
}

export const envVars: EnvConfig = loadEnvVariables();