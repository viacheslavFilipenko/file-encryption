import {
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
    StreamableFile,
    Param,
} from '@nestjs/common';
import { memoryStorage } from 'multer';
import {FileInterceptor, } from "@nestjs/platform-express";
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { v4 } from 'uuid';
import { contentType, lookup, extension } from 'mime-types';

@Controller('files')
export class FileController {
    constructor() {}

    @Get(':fileName')
    getFile(@Param('fileName') fileName: string): StreamableFile {
        const filePath = join(process.cwd(), 'uploads', fileName);
        const file = createReadStream(filePath);
        const mimetype = contentType(fileName) || 'application/octet-stream';

        return new StreamableFile(file, {
            type: mimetype,
            disposition: 'attachment',
        });
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File): string {
        const mimeType = lookup(file.originalname) || 'application/octet-stream';
        const ext = extension(mimeType) || 'bin';
        const fileName = `${v4()}.${ext}`;
        const filePath = join(process.cwd(), 'uploads',fileName);
        const fileStream = createWriteStream(filePath);

        fileStream.write(file.buffer);

        return `http://localhost:3000/files/${fileName}`;
    }
}
