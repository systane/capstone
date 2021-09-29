import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'

import { updatePokemon } from '../../usecase/pokemon/updatePokemonUseCase'
import { UpdatePokemonRequest } from '../../requests/UpdatePokemonRequest'
import { getUserId } from '../../utils/utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('updatePokemon');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Starting process to update pokemon');

    const userId = getUserId(event);
    const pokemonId = event.pathParameters.pokemonId;
    const updatedPokemon: UpdatePokemonRequest = JSON.parse(event.body);
    await updatePokemon(userId, pokemonId, updatedPokemon);

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: null
    };
    
  }
); 