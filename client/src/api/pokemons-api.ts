import { apiEndpoint } from '../config'
import { Pokemon } from '../types/Pokemon';
import { CreatePokemonRequest } from '../types/CreatePokemonRequest';
import Axios from 'axios'
import { UpdatePokemonRequest } from '../types/UpdatePokemonRequest';

export async function getPokemons(idToken: string): Promise<Pokemon[]> {
  console.log('Fetching pokemons')

  const response = await Axios.get(`${apiEndpoint}/pokemons`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Pokemons:', response.data)
  return response.data.items
}

export async function createPokemon(
  idToken: string,
  newPokemon: CreatePokemonRequest
): Promise<Pokemon> {
  const response = await Axios.post(`${apiEndpoint}/pokemons`,  JSON.stringify(newPokemon), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchPokemon(
  idToken: string,
  pokemonId: string,
  updatedPokemon: UpdatePokemonRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/pokemons/${pokemonId}`, JSON.stringify(updatedPokemon), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deletePokemon(
  idToken: string,
  pokemonId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/pokemons/${pokemonId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  pokemonId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/pokemons/${pokemonId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
