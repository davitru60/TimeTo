const getImagesFromDropbox = async (dbx, folderPath) => {
  try {
    // Llamar a la API de Dropbox para listar los archivos de la carpeta
    const response = await dbx.filesListFolder({ path: folderPath });

    // Filtrar solo los archivos de imagen
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const images = response.result.entries.filter((file) =>
      imageExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );

    // Construir las URLs correctamente
    const imageUrls = images.map((image) => ({
      name: image.name,
      url: `${process.env.REQUEST_URL}${process.env.PORT}${process.env.IMAGE_REQUEST}/show-image?path=${encodeURIComponent(
        image.path_display
      )}`,
    }));

    return imageUrls;
  } catch (error) {
    console.error("Error fetching images from Dropbox:", error);
    throw error;
  }
};

module.exports = {
  getImagesFromDropbox,
};
