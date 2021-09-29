import { PokemonRepository } from '../../repository/pokemonRepository';
import { UpdatePokemonRequest } from '../../requests/UpdatePokemonRequest';
import { PokemonUpdateModel } from '../../models/PokemonUpdateModel';

const pokemonRepository = new PokemonRepository();

export async function updatePokemon(
    userId: string,
    pokemonId: string,
    updatePokemonRequest: UpdatePokemonRequest
): Promise<void> {

    const pokemonUpdate = {
        name: updatePokemonRequest.name,
        dueDate: updatePokemonRequest.dueDate,
        done: true,
    } as PokemonUpdateModel;
    await pokemonRepository.updatePokemon(userId, pokemonId, pokemonUpdate);
};