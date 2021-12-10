import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

const PORT = process.env.PORT || 5000;

const startapp = async () => {
  try{
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('Docs')
        .setDescription('The cars API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(PORT);
  } catch (e) {
    console.log(e);
  }
}

startapp().then(() => console.log(`SERVER LISTENING ON PORT[${PORT}]`));

