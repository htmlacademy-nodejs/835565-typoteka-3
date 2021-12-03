'use strict';

const path = require(`path`);
const chalk = require(`chalk`);

const {copyFiles, createDirs} = require(`../../utils/utils-common`);
const {getMockData, createMockData} = require(`../../utils/utils-data`);
const {
  DEFAULT_COUNT,
  UPLOAD_DIR_PATH,
  SEEDERS_IMG_DIR_PATH,
  MOCK_SEEDERS_DIR_PATH,
  ExitCode,
} = require(`../../const`);


module.exports = {
  name: `--generate-seeders`,
  async run(args) {

    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const {
      mockUsers,
      mockArticles,
      mockCategories,
      mockComments,
      mockArticlesCategories
    } = await getMockData(articlesCount);

    const data = {
      mockUsers: JSON.stringify(mockUsers),
      mockArticles: JSON.stringify(mockArticles),
      mockCategories: JSON.stringify(mockCategories),
      mockComments: JSON.stringify(mockComments),
      mockArticlesCategories: JSON.stringify(mockArticlesCategories),
    };

    try {
      await Promise.all([
        createDirs([MOCK_SEEDERS_DIR_PATH, UPLOAD_DIR_PATH]),
        copyFiles(
            path.resolve(process.cwd(), SEEDERS_IMG_DIR_PATH),
            path.resolve(process.cwd(), UPLOAD_DIR_PATH)
        ),
        createMockData(data)
      ]);

      console.info(chalk.green(`Operation finished successfully.`));
      process.exit();
    } catch (error) {
      console.error(
          chalk.red(`Error occurred while generating seeders data: ${error.message}`)
      );
      process.exit(ExitCode.ERROR);
    }
  },
};
