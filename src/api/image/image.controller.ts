import { FastifyReply, FastifyRequest } from "fastify";
import path from "node:path";
import sharp from "sharp";
import fs from "node:fs"
import { pipeline } from "node:stream/promises";

// export const handleImage = async (req: FastifyRequest, reply: FastifyReply) => {
//     const contentType = req.headers["content-type"];
//     if (!contentType.startsWith("image/")) {
//         return reply.status(400).send({ error: "Not an Image"})
//     }
//     const imgStream = req.raw;

//     const outputDir = path.resolve("src/image/output")
//     const outputPath = path.join(outputDir, "that.webp")

//   await fs.promises.mkdir(outputDir, { recursive: true })

//     const transform = sharp()
//         .rotate()
//         .resize({ width: 1600, withoutEnlargement: true })
//         .webp({ quality: 75 })


//     const writeStream = fs.createWriteStream(outputPath)

//     await new Promise<void>((resolve, reject) => {
//         imgStream
//         .pipe(transform)
//         .pipe(writeStream)
//         .on("finish", resolve)
//         .on("error", reject)
//     })
    
//     return {
//         ok: true,
//         output: outputPath
//     }
// }

// export async function handleImage(request: FastifyRequest, reply: FastifyReply) {
//   const ct = request.headers["content-type"]
//   if (!ct?.startsWith("image/")) {
//     return reply.status(415).send({ error: `Unsupported Media Type: ${ct}` })
//   }

//   const input = request.body as NodeJS.ReadableStream
//   if (!input || typeof (input as any).pipe !== "function") {
//     return reply.status(400).send({ error: "Request body is not a stream" })
//   }

//   const outDir = path.resolve("src/image/output")
//   await fs.promises.mkdir(outDir, { recursive: true })
//   const outPath = path.join(outDir, `test.webp`)

//   const transformer = sharp()
//     .rotate() // handles EXIF orientation (mostly jpeg, but ok)
//     .resize({ width: 1600, withoutEnlargement: true })
//     .webp({ quality: 75 })

//   await pipeline(input, transformer, fs.createWriteStream(outPath))

//   return reply.send({ ok: true, outPath })
// }
export const handleImage = async (req: FastifyRequest, reply: FastifyReply) => {
    const part = await req.file()
    // req.log.info({ truncated: (data as any).truncated, filename: data.filename, mimetype: data.mimetype }, "upload")
    if (!part) return reply.status(400).send({ ok: false, message: "No file uploaded" })

    // Optional: enforce the field name
    if (part.fieldname !== "image") {
        return reply.status(400).send({ ok: false, message: "Expected field 'image'" })
    }

    // If your plugin limits truncate the file, catch it early
    if ((part as any).truncated) {
        return reply.status(413).send({ ok: false, message: "File too large (upload truncated)" })
    }

    const transformer = sharp()
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 75 })
        
    const outDir = path.resolve("src/image/output")
    await fs.promises.mkdir(outDir, { recursive: true })
    const outPath = path.join(outDir, `something.webp`)

    try {
        await pipeline(part.file, transformer, fs.createWriteStream(outPath))

        return reply.send({ ok: true, outPath })
    } catch (err: any) {
        req.log.error({ err }, "image conversion failed")
        return reply.status(400).send({
        ok: false,
        message: err?.message ?? "Image conversion failed",
        })
    }
    
}