// src/main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('Starting NestJS application...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Port:', process.env.PORT || 3000);
    console.log('Node version:', process.version);

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Enable global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strip properties that don't have decorators
        forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
        transform: true, // Automatically transform payloads to DTO instances
      }),
    );

    // Enable class serializer to exclude password from responses
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    // Enable CORS if needed
    app.enableCors();

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');

    console.log(`Application is running on: http://0.0.0.0:${port}`);
    console.log('Application started successfully!');
  } catch (error: unknown) {
    console.error('Error during bootstrap:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

bootstrap().catch((err: unknown) => {
  console.error('Failed to start application:', err);
  if (err instanceof Error) {
    console.error('Error stack:', err.stack);
  }
  process.exit(1);
});
