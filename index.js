const { download } = require("./download");
const { uploadFiles } = require("./upload");

(async () => {
  await download();

  await uploadFiles();
})();
