import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {FileController} from "src/files/file.controller";
import {MulterModule} from "@nestjs/platform-express";

@Module({
  imports: [
  MulterModule.registerAsync({
    useFactory: () => ({
      dest: './uploads',
    }),
  })],
  controllers: [AppController, FileController],
  providers: [AppService],
})
export class AppModule {}
