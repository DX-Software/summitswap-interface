// eslint-disable-next-line import/prefer-default-export
export function convertFileToBase64(file: File) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);

    fr.onloadend = () => {
      resolve(fr.result);
    };
  });
}
