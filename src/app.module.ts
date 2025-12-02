// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => {
        // Log ALL environment variables that might be database-related
        const allEnvVars = Object.keys(process.env)
          .filter(
            (key) =>
              key.toUpperCase().includes('MYSQL') ||
              key.toUpperCase().includes('DATABASE') ||
              key.toUpperCase().includes('DB_') ||
              key === 'DATABASE_URL',
          )
          .reduce(
            (acc, key) => {
              const value = process.env[key];
              // Mask sensitive values
              if (
                key.toUpperCase().includes('PASSWORD') ||
                key.toUpperCase().includes('URL') ||
                key === 'DATABASE_URL'
              ) {
                acc[key] = value ? '***' : 'not set';
              } else {
                acc[key] = value || 'not set';
              }
              return acc;
            },
            {} as Record<string, string>,
          );

        console.log(
          '🔍 All database-related environment variables:',
          allEnvVars,
        );
        console.log(
          '📋 Total env vars count:',
          Object.keys(process.env).length,
        );

        // Log ALL environment variables to see what Railway is actually providing
        const allEnvVarNames = Object.keys(process.env).sort();
        console.log('🔎 ALL Environment Variable Names:', allEnvVarNames);
        console.log(
          '💡 This will help us see what Railway is actually passing to the container',
        );

        // Log available database-related environment variables for debugging
        console.log('Available DB env vars:', {
          DATABASE_URL: process.env.DATABASE_URL ? '***' : undefined,
          MYSQL_URL: process.env.MYSQL_URL ? '***' : undefined,
          MYSQL_PUBLIC_URL: process.env.MYSQL_PUBLIC_URL ? '***' : undefined,
          MYSQLHOST: process.env.MYSQLHOST,
          MYSQLPORT: process.env.MYSQLPORT,
          MYSQLUSER: process.env.MYSQLUSER,
          MYSQLPASSWORD: process.env.MYSQLPASSWORD ? '***' : undefined,
          MYSQLDATABASE: process.env.MYSQLDATABASE,
          DB_HOST: process.env.DB_HOST,
          DB_PORT: process.env.DB_PORT,
          DB_USERNAME: process.env.DB_USERNAME,
          DB_PASSWORD: process.env.DB_PASSWORD ? '***' : undefined,
          DB_DATABASE: process.env.DB_DATABASE,
          DB_NAME: process.env.DB_NAME,
        });

        // Initialize with defaults
        const dbConfig: {
          type: string;
          host: string;
          port: number;
          username: string;
          password: string;
          database: string;
        } = {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'userdb',
        };

        // Parse DATABASE_URL or MYSQL_URL first (Railway format: mysql://user:pass@host:port/db)
        // Prioritize internal URL for Railway (faster, more reliable within Railway network)
        // Then public URL, then DATABASE_URL
        const databaseUrl =
          process.env.MYSQL_URL || // Internal Railway URL (preferred)
          process.env.DATABASE_URL ||
          process.env.MYSQL_PUBLIC_URL; // Public Railway URL (fallback)

        if (databaseUrl) {
          try {
            // Decode URL-encoded characters (e.g., %40 for @, %3A for :)
            const decodedUrl = decodeURIComponent(databaseUrl);
            const url = new URL(decodedUrl);

            // Extract hostname (required)
            if (url.hostname) {
              dbConfig.host = url.hostname;
            } else {
              throw new Error('Missing hostname in DATABASE_URL');
            }

            // Extract port (default to 3306 if not specified)
            if (url.port) {
              const port = parseInt(url.port, 10);
              if (!isNaN(port) && port > 0 && port < 65536) {
                dbConfig.port = port;
              } else {
                console.warn(
                  `Invalid port in DATABASE_URL: ${url.port}, using default 3306`,
                );
              }
            }

            // Extract username (default to 'root' if not specified)
            if (url.username) {
              // Decode username in case it's URL-encoded
              dbConfig.username = decodeURIComponent(url.username);
            }

            // Extract password (can be empty, but decode if present)
            if (url.password !== undefined) {
              dbConfig.password = decodeURIComponent(url.password);
            }

            // Extract database name from pathname
            // Handle cases like: /railway, /railway/, railway, etc.
            if (url.pathname) {
              // Remove leading slash and any trailing slashes
              const dbName = url.pathname.replace(/^\/+|\/+$/g, '');
              if (dbName) {
                dbConfig.database = dbName;
              } else {
                console.warn(
                  'Empty database name in DATABASE_URL pathname, using default',
                );
              }
            } else {
              console.warn(
                'No database name in DATABASE_URL pathname, using default',
              );
            }

            // Validate we have required fields
            if (!dbConfig.host) {
              throw new Error('Database host is required but missing');
            }

            console.log('Successfully parsed DATABASE_URL for connection');
          } catch (error) {
            console.error(
              'Failed to parse DATABASE_URL:',
              error instanceof Error ? error.message : error,
            );
            console.error(
              'DATABASE_URL format should be: mysql://user:password@host:port/database',
            );
            // Continue with fallback to individual env vars
          }
        } else {
          // Fall back to individual environment variables
          if (process.env.MYSQLHOST) {
            dbConfig.host = process.env.MYSQLHOST;
          } else if (process.env.DB_HOST) {
            dbConfig.host = process.env.DB_HOST;
          }

          if (process.env.MYSQLPORT) {
            const port = parseInt(process.env.MYSQLPORT, 10);
            if (!isNaN(port)) dbConfig.port = port;
          } else if (process.env.DB_PORT) {
            const port = parseInt(process.env.DB_PORT, 10);
            if (!isNaN(port)) dbConfig.port = port;
          }

          if (process.env.MYSQLUSER) {
            dbConfig.username = process.env.MYSQLUSER;
          } else if (process.env.DB_USERNAME) {
            dbConfig.username = process.env.DB_USERNAME;
          }

          if (process.env.MYSQLPASSWORD !== undefined) {
            dbConfig.password = process.env.MYSQLPASSWORD;
          } else if (process.env.DB_PASSWORD !== undefined) {
            dbConfig.password = process.env.DB_PASSWORD;
          }

          if (process.env.MYSQLDATABASE) {
            dbConfig.database = process.env.MYSQLDATABASE;
          } else if (process.env.DB_DATABASE) {
            dbConfig.database = process.env.DB_DATABASE;
          } else if (process.env.DB_NAME) {
            dbConfig.database = process.env.DB_NAME;
          }
        }

        // Determine if we're in production (Railway sets RAILWAY_ENVIRONMENT)
        const isProduction =
          process.env.NODE_ENV === 'production' ||
          process.env.RAILWAY_ENVIRONMENT === 'production';

        // Validate configuration before returning
        const missingFields: string[] = [];
        if (!dbConfig.host || dbConfig.host === 'localhost') {
          if (isProduction) {
            missingFields.push('host (still using localhost in production!)');
          }
        }
        if (!dbConfig.database) {
          missingFields.push('database name');
        }
        if (!dbConfig.username) {
          missingFields.push('username');
        }

        if (missingFields.length > 0 && isProduction) {
          console.error(
            `❌ ERROR: Missing database configuration fields: ${missingFields.join(', ')}`,
          );
          console.error(
            '🔧 SOLUTION: Add one of these variables to your APPLICATION service in Railway:',
          );
          console.error('   1. MYSQL_URL (preferred - internal Railway URL)');
          console.error('   2. DATABASE_URL');
          console.error('   3. MYSQL_PUBLIC_URL');
          console.error(
            '   OR add individual variables: MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE',
          );
          console.error(
            '   Note: Variables must be added to your APPLICATION service, not just the MySQL service!',
          );
        }

        // Log database config (without password) for debugging
        console.log('Final Database Config:', {
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          database: dbConfig.database,
          isProduction,
          hasPassword: !!dbConfig.password,
          configSource: databaseUrl ? 'DATABASE_URL' : 'individual env vars',
        });

        return {
          type: 'mysql' as const,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          // Use explicit entity import (more reliable than path patterns)
          entities: [User],
          synchronize: !isProduction, // Only sync in development
          logging: !isProduction, // Only log in development
          retryAttempts: 10, // Increase retry attempts
          retryDelay: 3000,
          connectTimeout: 60000, // 60 second connection timeout
          extra: {
            connectionLimit: 10,
          },
        };
      },
    }),

    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
