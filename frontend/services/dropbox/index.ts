import { Dropbox } from "dropbox";

const appToken =
  "kAHqxFrZ6HkAAAAAAAAAAV1i7vlAOEoMrj-NAIaim-_eixz7Nt7iYPohqoU3EUtx";

let dropboxSdk: Dropbox = null; //new Dropbox({ accessToken: appToken });

const getDroboxInstance = () => {
  if (!dropboxSdk) {
    dropboxSdk = new Dropbox({ accessToken: appToken });
  }
  return dropboxSdk;
};

export const uploadDropboxFile = async (
  iata: string,
  filename: string,
  csvFile: string
) => {
  const sdk = getDroboxInstance();
  const path = `/AirtableCSVExport/${iata.toUpperCase()}/${filename}`;
  const uploadData = await sdk.filesUpload({
    path,
    contents: csvFile,
    autorename: true,
  });

  const downloadLink = await sdk.filesGetTemporaryLink({
    path: uploadData.result.path_display,
  });

  if (!downloadLink.result.link) {
    throw new Error("Download from dropbox failed");
  }

  return {
    csvUrl: downloadLink.result.link,
    csvFilename: filename,
    dropboxData: uploadData,
  };
};

export const removeFromDropbox = async (dropboxPath: string) => {
  const ctx = new Dropbox({ accessToken: appToken });
  const data = await ctx.filesDeleteV2({ path: dropboxPath });

  return data;
};
