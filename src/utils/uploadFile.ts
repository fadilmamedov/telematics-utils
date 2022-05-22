export const uploadFile = (accept: string) =>
  new Promise<string>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;

    input.addEventListener("change", function () {
      if (!this.files) return;

      const file = this.files[0];
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };
    });

    input.click();
  });
