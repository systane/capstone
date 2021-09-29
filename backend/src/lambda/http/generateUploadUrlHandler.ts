import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'

import { createAttachmentPresignedUrl } from '../../usecase/pokemon/createAttachmentPresignedUrlUseCase'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';

const logger = createLogger('generateUploadUrl');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Starting process to generate the upload url');

    const pokemonId = event.pathParameters.pokemonId
    const userId = getUserId(event);
    const uploadUrl = await createAttachmentPresignedUrl(pokemonId, userId);

    return {
      statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          uploadUrl: uploadUrl
        })
    };
    
  }
);