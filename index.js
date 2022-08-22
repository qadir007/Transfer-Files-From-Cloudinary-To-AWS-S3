const { download } = require("./utils/download");
const { uploadFiles } = require("./utils/upload");

(async () => {
  await download();

  await uploadFiles();
})();
