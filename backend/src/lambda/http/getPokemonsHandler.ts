import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'

import { getPokemonsForUser as getPokemonsForUser } from '../../usecase/pokemon/getPokemonsByUserIdUseCase'
import { getUserId } from '../../utils/utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getAllPokemons');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Starting process to get pokemons by user');

    const userId = getUserId(event);

    const pokemons = await getPokemonsForUser(userId);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: pokemons
      })
    };

  }
); 