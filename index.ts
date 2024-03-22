import { Buffer } from "buffer";

type BinaryToTextEncoding = "binary" | "base64" | "base64url" | "hex";

export default {
    createHash,
    randomBytes,
    randomFillSync
}

export function createHash(type: ChecksumType): Hash {
    return new Hash(new Checksum(type));
}

export class Hash {
    checksum: Checksum;

    constructor(checksum: Checksum) {
        this.checksum = checksum;
    }

    update(data: string | Buffer | DataView, inputEncoding?: string): Hash {
        if (data instanceof DataView) {
            const uint8Array = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            this.checksum.update(uint8Array.buffer as ArrayBuffer);
        } else if (inputEncoding !== undefined) {
            if (typeof data !== 'string') {
                throw new Error("Input data must be a string when inputEncoding is specified");
            }
            const buffer = Buffer.from(data, inputEncoding as BinaryToTextEncoding);
            this.checksum.update(Array.from(buffer));
        } else if (data instanceof Buffer) {
            this.checksum.update(Array.from(data));
        } else {
            this.checksum.update(data as string);
        }
        return this;
    }

    digest(encoding: BinaryToTextEncoding = "binary"): Buffer | string {
        if (encoding === "hex")
            return this.checksum.getString();
        const rawDigest = Buffer.from(this.checksum.getDigest());
        if (encoding === "binary")
            return rawDigest;
        return rawDigest.toString(encoding);
    }

    copy(): Hash {
        return new Hash(this.checksum);
    }
}

export function randomBytes(size: number, callback?: (err: Error | null, buf: Buffer) => void): Buffer | void {
    if (callback && typeof callback === 'function') {
        const bytes = Buffer.allocUnsafe(size);
        for (let i = 0; i < size; i++)
            bytes[i] = Math.floor(Math.random() * 256);
        callback(null, bytes);
    } else {
        const bytes = Buffer.allocUnsafe(size);
        for (let i = 0; i < size; i++)
            bytes[i] = Math.floor(Math.random() * 256);
        return bytes;
    }
}

export function randomFillSync(buffer: Buffer | Uint8Array | DataView, offset = 0, size?: number): Buffer | Uint8Array | DataView {
    if (!size) size = buffer.byteLength - offset;
    if (offset < 0 || size < 0 || offset + size > buffer.byteLength)
        throw new RangeError("Invalid offset or size");
    if (buffer instanceof Buffer || buffer instanceof Uint8Array) {
        for (let i = offset; i < offset + size; i++)
            buffer[i] = Math.floor(Math.random() * 256);
    } else if (buffer instanceof DataView) {
        const uint8Array = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        for (let i = offset; i < offset + size; i++)
            uint8Array[i] = Math.floor(Math.random() * 256);
        return buffer;
    }
    return buffer;
}
