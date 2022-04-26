require('dotenv').config();
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';

const start = async () => {
    try {
        const app = await NestFactory.create<NestExpressApplication>(AppModule);  // express базовый функционал
        const port = process.env.API_PORT || 5000
        await app.listen(port, () => console.log(`\n[WEB] ${process.env.API_URL} [PORT] ${port}`));
    } catch (e) {
        console.log(e);
    }
}

start();