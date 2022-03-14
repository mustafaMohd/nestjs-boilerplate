import * as dotenv from 'dotenv';
import * as joi from 'joi';

/**
 * Key-value mapping
 */
export interface EnvConfig {
  [key: string]: string;
}

/**
 * Config Service
 */
export class ConfigService {
  /**
   * Object that will contain the injected environment variables
   */
  private readonly envConfig: EnvConfig;

  /**
   * Constructor
   * @param {string} filePath
   */
  constructor() {
    // const config = parse(fs.readFileSync(filePath));
    // this.envConfig = ConfigService.validateInput(config);
    const result = dotenv.config();

    if (result.error) {
      this.envConfig = process.env;
    } else {
      this.envConfig = result.parsed;
    }
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   * @param {EnvConfig} envConfig the configuration object with variables from the configuration file
   * @returns {EnvConfig} a validated environment configuration object
   */
  private static validateInput(envConfig: EnvConfig): EnvConfig {
    /**
     * A schema to validate envConfig against
     */
    const envVarsSchema: joi.ObjectSchema = joi
      .object({
        APP_ENV: joi.string().valid('dev', 'prod', 'test').default('dev'),
        PORT: joi.number().default(3000),
        JWT_SECRET: joi.string().required(),
        JWT_ACCESS_EXPIRATION_MINUTES: joi.number().default(2400),
        JWT_REFRESH_EXPIRATION_DAYS: joi.number().default(360),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi.number().default(10),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi.number().default(10),
        MONGODB_URL: joi.string().regex(/^mongodb/),
        SMTP_PORT: joi.number().description('port to connect to the email server'),
        SMTP_USERNAME: joi.string().description('username for email server'),
        SMTP_PASSWORD: joi.string().description('password for email server'),
        EMAIL_FROM: joi.string().description('the from field in the emails sent by the app'),
      })
      .unknown();

    /**
     * Represents the status of validation check on the configuration file
     */
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  /**
   * Fetches the key from the configuration file
   * @param {string} key
   * @returns {string} the associated value for a given key
   */
  get(key: string): string {
    return this.envConfig[key];
  }

  /**
   * Checks whether the application environment set in the configuration file matches the environment parameter
   * @param {string} env
   * @returns {boolean} Whether or not the environment variable matches the application environment
   */
  isEnv(env: string): boolean {
    return this.envConfig.APP_ENV === env;
  }
  public async getPortConfig() {
    return this.get('PORT');
  }

  public async getMongoConfig() {
    return {
      uri: this.get('MONGODB_URL'),
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }
}
