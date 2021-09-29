import * as AWS from 'aws-sdk';
import * as AWSXRAY from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PokemonItemModel } from '../models/PokemonItemModel';
import { PokemonUpdateModel } from '../models/PokemonUpdateModel';
import { createLogger } from '../utils/logger';

const XAWS = AWSXRAY.captureAWS(AWS);

export class PokemonRepository {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly pokemonsTable = process.env.POKEMONS_TABLE,
        private readonly indexName = process.env.USER_ID_INDEX,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    ){};

    async getAllPokemons(userId: string): Promise<PokemonItemModel[]> {
        const logger = createLogger('getAllPokemons'); 
        logger.info('Getting all pokemons');

        const result = await this.docClient.query({
            TableName: this.pokemonsTable,
            KeyConditionExpression: 'userId = :userId',
            IndexName: this.indexName,
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ProjectionExpression: 'pokemonId, createdAt, #name, dueDate, done, attachmentUrl',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
        }).promise();

        const items = result.Items;
        return items as PokemonItemModel[];
    };

    async createPokemon(pokemon: PokemonItemModel): Promise<PokemonItemModel> {
        const logger = createLogger('createPokemon');
        logger.info(`Creating a pokemon with id ${pokemon.pokemonId}`);

        await this.docClient.put({
            TableName: this.pokemonsTable,
            Item: pokemon
        }).promise();

        return pokemon;
    };

    async updatePokemon(userId: string, pokemonId: string, pokemonUpdate: PokemonUpdateModel): Promise<PokemonUpdateModel> {
        const logger = createLogger('updatePokemon');
        logger.info(`Updating a pokemon with name ${pokemonUpdate.name}`);

        const pokemonSaved = await this.getPokemon(pokemonId, userId);

        await this.docClient.update({
            TableName: this.pokemonsTable,
            Key: {
                userId,
                createdAt: pokemonSaved.createdAt
            },
            ConditionExpression: 'pokemonId = :pokemonId',
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': pokemonUpdate.name,
                ':dueDate': pokemonUpdate.dueDate,
                ':done': pokemonUpdate.done,
                ':pokemonId': pokemonId
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();

        
        return pokemonUpdate;
    };

    async deletePokemon(pokemonId: string, userId: string): Promise<void> {
        const logger = createLogger('deletePokemon');
        logger.info('Deleting pokemon');

        const pokemonToDelete = await this.getPokemon(pokemonId, userId);

       await this.docClient.delete({
            TableName: this.pokemonsTable,
            Key: {
                userId,
                createdAt: pokemonToDelete.createdAt
            },
            ConditionExpression: 'pokemonId = :pokemonId',
            ExpressionAttributeValues: {
                ':pokemonId': pokemonId
            }
        }).promise();
    };

    async getPokemon(pokemonId: string, userId: string): Promise<PokemonItemModel> {
        const logger = createLogger('getPokemon'); 
        logger.info('Getting pokemons by pokemonid and userId');

        const result = await this.docClient.query({
            TableName: this.pokemonsTable,
            KeyConditionExpression: 'pokemonId = :pokemonId and userId = :userId',
            IndexName: this.indexName,
            ExpressionAttributeValues: {
                ':pokemonId': pokemonId,
                ':userId': userId
            }
        }).promise();

        const items = result.Items;
        return items[0] as PokemonItemModel;
    };

    async updateAttachmentUrl(pokemonId: string, userId: string, imageId: string): Promise<void> {
        const logger = createLogger('updateAttachmentUrl');
        logger.info('Updating attachmentUrl');
        
        const pokemon = await this.getPokemon(pokemonId, userId);

        await this.docClient.update({
            TableName: this.pokemonsTable,
            Key: {
                userId,
                createdAt: pokemon.createdAt
            },
            ConditionExpression: 'pokemonId = :pokemonId',
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
              ':attachmentUrl': `https://${this.bucketName}.s3.amazonaws.com/${imageId}`,
              ':pokemonId': pokemonId,
            },
        }).promise();
    };
}

function createDynamoDBClient() {
    if(process.env.IS_OFFLINE) {
        console.log('Creating a local dynamodb instance');
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        });
    }

    return new AWS.DynamoDB.DocumentClient();
};