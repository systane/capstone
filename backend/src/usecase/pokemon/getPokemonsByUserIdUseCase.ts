import { PokemonItemModel } from '../../models/PokemonItemModel';
import { PokemonRepository } from '../../repository/pokemonRepository';

const pokemonRepository = new PokemonRepository();

export async function getPokemonsForUser(userId: string): Promise<PokemonItemModel[]> {
    return await pokemonRepository.getAllPokemons(userId);
};