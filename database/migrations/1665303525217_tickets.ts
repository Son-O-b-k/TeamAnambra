import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user')
      table.string('boarding_location').defaultTo(null)
      table.string('destination').defaultTo(null)
      table.string('vehicle_number').defaultTo(null)
      table.integer('seat_number').defaultTo(0)
      table.string('ticket_code').defaultTo(null)
      table.string('boarding_time').defaultTo(null)
      table.text('qrcode').defaultTo(null)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
