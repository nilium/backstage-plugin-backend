import { Knex } from 'knex';
import { RawDbEntityResultRow } from '../src/db/PagerDutyBackendDatabase'; 

const EntityMappings = 'pagerduty_entity_mapping';

export async function up(knex: Knex) {
    await knex.schema.alterTable(EntityMappings, table => {
        table.dropUnique(['serviceId']);
        table.unique(['serviceId', 'entityRef']);
    });
};

export async function down(knex: Knex) {
    const entityMappings = () => knex.table<RawDbEntityResultRow, RawDbEntityResultRow[]>(EntityMappings);

    const initialIds = entityMappings()
        .min('id')
        .groupBy('serviceId')
        .select('id');

    await entityMappings()
        .delete()
        .whereNotIn('id', initialIds);
    
    await knex.schema.alterTable(EntityMappings, table => {
        table.unique(['serviceId']);
        table.dropUnique(['serviceId', 'entityRef']);
    });
};

