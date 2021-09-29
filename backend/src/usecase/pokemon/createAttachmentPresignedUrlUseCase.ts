import { createAttachmentPresignedUrlGateway } from '../../gateway/s3/createAttachmentPresignedUrlGateway';
import { CreateAttachmentPresignedUrlGatewayImpl } from '../../gateway/s3/impl/createAttachmentPresignedUrlImplGatewayImpl';

const createAttachmentPresignedUrlGateway: createAttachmentPresignedUrlGateway = new CreateAttachmentPresignedUrlGatewayImpl();

export async function createAttachmentPresignedUrl(pokemonId: string, userId: string): Promise<string> {
    const key = `${pokemonId}_${userId}`;
    return await createAttachmentPresignedUrlGateway.execute(key);
};