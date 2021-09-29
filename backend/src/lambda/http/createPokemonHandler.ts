import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { CreatePokemonRequest } from '../../requests/CreatePokemonRequest'
import { getUserId } from '../../utils/utils';
import { createPokemon } from '../../usecase/pokemon/createPokemonUseCase'
import { createLogger } from '../../utils/logger';

const logger = createLogger('createPokemon');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Starting process to create pokemon');

    const newPokemon: CreatePokemonRequest = JSON.parse(event.body)
    const userId = getUserId(event);
    const pokemon = await createPokemon(newPokemon, userId);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: pokemon
      })
    };
    
  }
); 
