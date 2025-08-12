import {
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
    StreamableFile, Param, Res,
} from '@nestjs/common';
import { memoryStorage } from 'multer';
import {FileInterceptor, } from "@nestjs/platform-express";
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { v4 } from 'uuid';

@Controller('files')
export class FileController {
    constructor() {}

    @Get(':fileName')
    getFile(@Param('fileName') fileName: string): StreamableFile {
        const filePath = join(process.cwd(), 'uploads', fileName);
        const file = createReadStream(filePath);

        return new StreamableFile(file, {
            type: `image/png`,
            disposition: 'attachment',
            length: undefined, // You can set the length if known
        });
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: { fileSize: 20 * 1024 * 1024 },
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File): string {
        const { mimetype } = file;
        const fileExtension = mimetype.split('/')[1];
        const uuid = v4();
        const filePath = join(process.cwd(), 'uploads', `${uuid}.${fileExtension}`);
        const fileStream = createWriteStream(filePath);

        fileStream.write(file.buffer);

        return `http://localhost:3000/files/${uuid}.${fileExtension}`;
    }
}
