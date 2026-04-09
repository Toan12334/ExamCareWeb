import axiosClient from "./http.js"


export const uploadMany = async (files = []) => {
    const formData = new FormData();
  
    // Duyệt qua mảng files (chính là formData.images từ state của bạn)
    files.forEach((item) => {
      // Lưu ý: item.file là đối tượng File nhị phân thật sự
      formData.append("images", item.file); 
    });
  
    // Gửi FormData qua axios
    const response = await axiosClient.post("/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data)
  
    return response.data.data; 
  };