import {
  DatabaseOptions,
  displaySqlDialect,
  Framework,
  SqlDialect,
} from "@lib/core";
import { SequelizeFramework } from "@lib/frameworks";
import {
  alpha,
  buildProject,
  createDatabase,
  DbConnection,
  destroyProject,
  dropDatabase,
  preinstall,
  validateDialect,
} from "@lib/test-utils";
import { expect } from "chai";
import forEach from "mocha-each";
import { dvdSchema } from "./fixtures";

const sqlDialect: SqlDialect = validateDialect(process.env.SQL_DIALECT);

type DbTestConfig = {
  dbOptions: DatabaseOptions;
  tableName: string;
  expectedTables: string[];
  expectedColumns: string[];
};

const snakePlural: DbTestConfig = {
  dbOptions: {
    sqlDialect,
    timestamps: true,
    caseStyle: "snake",
    nounForm: "plural",
  },
  tableName: "customers",
  expectedTables: [
    "actors",
    "categories",
    "customers",
    "films",
    "film_actors",
    "film_categories",
    "languages",
    "inventories",
    "rentals",
    "staffs",
    "stores",
  ],
  expectedColumns: [
    "customer_id",
    "first_name",
    "last_name",
    "email",
    "created_at",
    "updated_at",
    "store_id",
  ],
};

const snakeSingular: DbTestConfig = {
  dbOptions: {
    sqlDialect,
    timestamps: true,
    caseStyle: "snake",
    nounForm: "singular",
  },
  tableName: "customer",
  expectedTables: [
    "actor",
    "category",
    "customer",
    "film",
    "film_actor",
    "film_category",
    "language",
    "inventory",
    "rental",
    "staff",
    "store",
  ],
  expectedColumns: [
    "customer_id",
    "first_name",
    "last_name",
    "email",
    "created_at",
    "updated_at",
    "store_id",
  ],
};
const camelPlural: DbTestConfig = {
  dbOptions: {
    sqlDialect,
    timestamps: true,
    caseStyle: "camel",
    nounForm: "plural",
  },
  tableName: "Customers",
  expectedTables: [
    "Actors",
    "Categories",
    "Customers",
    "FilmActors",
    "FilmCategories",
    "Films",
    "Languages",
    "Inventories",
    "Rentals",
    "Staffs",
    "Stores",
  ],
  expectedColumns: [
    "customerId",
    "firstName",
    "lastName",
    "email",
    "createdAt",
    "updatedAt",
    "storeId",
  ],
};

const camelSingular: DbTestConfig = {
  dbOptions: {
    sqlDialect,
    timestamps: true,
    caseStyle: "camel",
    nounForm: "singular",
  },
  tableName: "Customer",
  expectedTables: [
    "Actor",
    "Category",
    "Customer",
    "FilmActor",
    "FilmCategory",
    "Film",
    "Language",
    "Inventory",
    "Rental",
    "Staff",
    "Store",
  ],
  expectedColumns: [
    "customerId",
    "firstName",
    "lastName",
    "email",
    "createdAt",
    "updatedAt",
    "storeId",
  ],
};

const noTimestamps: DbTestConfig = {
  dbOptions: {
    sqlDialect,
    timestamps: false,
    caseStyle: "snake",
    nounForm: "plural",
  },
  tableName: "customers",
  expectedTables: [
    "actors",
    "categories",
    "customers",
    "films",
    "film_actors",
    "film_categories",
    "languages",
    "inventories",
    "rentals",
    "staffs",
    "stores",
  ],
  expectedColumns: [
    "customer_id",
    "first_name",
    "last_name",
    "email",
    "store_id",
  ],
};

const frameworks: [label: string, framework: Framework][] = [
  ["Sequelize", SequelizeFramework],
];

describe(`SQL tests (${displaySqlDialect(sqlDialect)})`, () => {
  const projectName = alpha(12);

  forEach(frameworks).describe("%s", (_label, framework: Framework) => {
    const projectType = framework.projectType();

    after(async () => {
      await destroyProject(projectType, projectName);
      await dropDatabase(projectName, sqlDialect);
    });

    const cases: [label: string, config: DbTestConfig][] = [
      ["snake plural", snakePlural],
      ["snake singular", snakeSingular],
      ["camel plural", camelPlural],
      ["camel singular", camelSingular],
      ["no timestamps", noTimestamps],
    ];

    forEach(cases).describe(
      "%s",
      function (
        _label,
        { dbOptions, tableName, expectedTables, expectedColumns }
      ) {
        this.timeout(60000);
        let client: DbConnection;

        before(async () => {
          const schema = dvdSchema(projectName);
          const directory = framework.generate({ schema, dbOptions });

          client = await createDatabase(projectName, sqlDialect);
          await buildProject(
            projectType,
            directory,
            preinstall(sqlDialect, projectType)
          );
        });

        after(async () => {
          await client.close();
        });

        it("should create the correct tables with the correct names", async () => {
          const tables = await client.getTables();
          expect(tables).to.have.members(expectedTables);
        });

        it("should create the correct columns with the correct names", async () => {
          const tables = await client.getColumns(tableName);
          expect(tables).to.have.members(expectedColumns);
        });
      }
    );
  });
});
