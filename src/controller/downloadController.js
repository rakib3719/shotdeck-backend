const downloadVimeoVideo = async (vimeoUrl) => {
  try {
    setIsDownloadingVimeo(true);
    setUploadProgress(0);
    
    const response = await axiosInstance.post(`${base_url}/shot/download-vimeo`, {
      url: vimeoUrl
    }).catch(error => {
      // Handle 404 error specifically
      if (error.response?.status === 404) {
        throw new Error("Vimeo download endpoint not found on server");
      }
      throw error;
    });
    
    const { downloadUrl } = response.data;
    
    if (!downloadUrl) {
      throw new Error("Failed to get Vimeo download URL");
    }
    
    // Rest of your download logic...
    
  } catch (error) {
    console.error("Error downloading Vimeo video:", error);
    Swal.fire({
      title: "Error",
      text: error.message || "Failed to download Vimeo video",
      icon: "error",
    });
    throw error;
  } finally {
    setIsDownloadingVimeo(false);
  }
};