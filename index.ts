import { Buffer } from "buffer";

export default {
    createHash,
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
        // TODO: TypedArray
        if (data instanceof DataView)
            throw new Error("DataView not yet supported");
        if (inputEncoding !== undefined)
            throw new Error("inputEncoding not yet supported");

        if (data instanceof Buffer)
            this.checksum.update(data.buffer as ArrayBuffer);
        else
            this.checksum.update(data);

        return this;
    }

    digest(encoding?: string): Buffer | string {
        if (encoding === "hex")
            return this.checksum.getString();

        return Buffer.from(this.checksum.getDigest());
    }

    copy(): Hash {
        throw new Error("copy() not yet supported");
    }
}
