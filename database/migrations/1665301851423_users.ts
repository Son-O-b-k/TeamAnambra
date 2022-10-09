import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('firstname').nullable()

      table.string('lastname').nullable()

      table.string('password').nullable()

      table.string('new_pwd_code').nullable()

      table.bigInteger('new_pwd_code_expire').defaultTo(0)

      table.string('username').nullable()

      table.string('profile').nullable()

      table.string('email').nullable()

      table.string('reg_type').nullable()

      table.string('settings').nullable()
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
