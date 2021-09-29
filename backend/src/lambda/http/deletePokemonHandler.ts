import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'

import { deletePokemon } from '../../usecase/pokemon/deletePokemonUseCase'
import { getUserId } from '../../utils/utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deletePokemon');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Starting process to delete pokemon');

    const pokemonId = event.pathParameters.pokemonId;
    const userId = getUserId(event);

    await deletePokemon(pokemonId, userId);
    
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: null
    };
  }
)
