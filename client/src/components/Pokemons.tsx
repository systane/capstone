import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createPokemon, deletePokemon, getPokemons, patchPokemon } from '../api/pokemons-api'
import Auth from '../auth/Auth'
import { Pokemon } from '../types/Pokemon'

interface PokemonsProps {
  auth: Auth
  history: History
}

interface PokemonsState {
  pokemons: Pokemon[]
  newPokemonName: string
  loadingPokemons: boolean
}

export class Pokemons extends React.PureComponent<PokemonsProps, PokemonsState> {
  state: PokemonsState = {
    pokemons: [],
    newPokemonName: '',
    loadingPokemons: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPokemonName: event.target.value })
  }

  onEditButtonClick = (PokemonId: string) => {
    this.props.history.push(`/pokemons/${PokemonId}/edit`)
  }

  onPokemonCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newPokemon = await createPokemon(this.props.auth.getIdToken(), {
        name: this.state.newPokemonName,
        dueDate
      })
      this.setState({
        pokemons: [...this.state.pokemons, newPokemon],
        newPokemonName: ''
      })
    } catch (e) {
      console.log(e);
      alert('Pokemon creation failed')
    }
  }

  onPokemonDelete = async (PokemonId: string) => {
    try {
      await deletePokemon(this.props.auth.getIdToken(), PokemonId)
      this.setState({
        pokemons: this.state.pokemons.filter(pokemon => pokemon.pokemonId !== PokemonId)
      })
    } catch {
      alert('Pokemon deletion failed')
    }
  }

  onPokemonCheck = async (pos: number) => {
    try {
      const pokemon = this.state.pokemons[pos]
      await patchPokemon(this.props.auth.getIdToken(), pokemon.pokemonId, {
        name: pokemon.name,
        dueDate: pokemon.dueDate,
        done: !pokemon.done
      })
      this.setState({
        pokemons: update(this.state.pokemons, {
          [pos]: { done: { $set: !pokemon.done } }
        })
      })
    } catch {
      alert('Pokemon deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const pokemons = await getPokemons(this.props.auth.getIdToken())
      this.setState({
        pokemons: pokemons,
        loadingPokemons: false
      })
    } catch (e) {
      alert(`Failed to fetch pokemons: ${e}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Pokemons</Header>

        {this.renderCreatePokemonInput()}

        {this.renderPokemons()}
      </div>
    )
  }

  renderCreatePokemonInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New pokemon',
              onClick: this.onPokemonCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Pokemon name"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderPokemons() {
    if (this.state.loadingPokemons) {
      return this.renderLoading()
    }

    return this.renderPokemonsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Pokemons
        </Loader>
      </Grid.Row>
    )
  }

  renderPokemonsList() {
    return (
      <Grid padded>
        {this.state.pokemons.map((pokemon, pos) => {
          return (
            <Grid.Row key={pokemon.pokemonId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onPokemonCheck(pos)}
                  checked={pokemon.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {pokemon.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {pokemon.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(pokemon.pokemonId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPokemonDelete(pokemon.pokemonId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {pokemon.attachmentUrl && (
                <Image src={pokemon.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
