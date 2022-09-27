import { join } from 'path';

import { config as readEnv } from 'dotenv';

type Config = {
  db: {
    vendor: any;
    host: string;
    logging: boolean;
  };
};

function makeConfig(envFile): Config {
  const output = readEnv({ path: envFile });

  return {
    db: {
      vendor: output.parsed.DB_VENDOR as any,
      host: output.parsed.DB_HOST,
      logging: output.parsed.DB_LOGGING === 'true',
    },
  };
}

//export const config = makeConfig(envFile);

const envTestingFile = join(__dirname, '../../../../.env.test');
export const configTest = makeConfig(envTestingFile);
