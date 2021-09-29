import { PokemonRepository } from '../../repository/pokemonRepository';

const pokemonRepository = new PokemonRepository();

export async function updateAttachmentUrl(imageId: string): Promise<void> {
    const index = imageId.indexOf('_');
    const PokemonId = imageId.substr(0, index);
    const userId = decodeURI(imageId.substr(index + 1));
    await pokemonRepository.updateAttachmentUrl(PokemonId, userId, imageId);
};