import { deleteImageGatewayGateway } from '../../gateway/s3/deleteImageGateway';
import { DeleteImageGatewayGatewayImpl } from '../../gateway/s3/impl/deleteImageGatewayImpl';
import { PokemonRepository } from '../../repository/pokemonRepository';

const pokemonRepository = new PokemonRepository();
const deleteImageGateway: deleteImageGatewayGateway = new DeleteImageGatewayGatewayImpl();

export async function deletePokemon(pokemonId: string, userId: string): Promise<void> {
    await pokemonRepository.deletePokemon(pokemonId, userId);
    const key = `${pokemonId}_${userId}`;
    await deleteImageGateway.execute(key);
};