import { PokemonItemModel } from '../../models/PokemonItemModel';
import { PokemonRepository } from '../../repository/pokemonRepository';
import { CreatePokemonRequest } from '../../requests/CreatePokemonRequest';
import * as uuid from 'uuid';

const pokemonRepository = new PokemonRepository();

export async function createPokemon(
    createPokemonRequest: CreatePokemonRequest,
    userId: string
): Promise<PokemonItemModel> {
    const pokemonId = uuid.v4();

    return await pokemonRepository.createPokemon({
        pokemonId,
        userId,
        name: createPokemonRequest.name,
        dueDate: createPokemonRequest.dueDate,
        done: false,
        attachmentUrl: "",
        createdAt: new Date().toISOString(),
    });
};
