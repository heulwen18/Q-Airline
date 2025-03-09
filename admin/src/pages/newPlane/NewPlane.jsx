import "./newPlane.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { planeInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch"
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";

const NewPlane = () => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});

  const { data, loading, error } = useFetch("/api/airplanes");
  useEffect(() => {
    if (data) {
      setInfo(data);
    }
  }, [data]);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = info.avatar;

      if (file) {
        const base64 = await toBase64(file);
        const uploadRes = await axiosInstance.post("/api/upload-avatar", { image: base64, name_folder: "airplane_uploads" });

        imageUrl = uploadRes.data.url;
      }

      console.log(imageUrl);

      // Chuẩn bị dữ liệu để gửi đến API
      const newPlane = {
        ...info,
        last_inspection_date: info.last_inspection_date || null,
        status: info.status || "active",
        avatar: imageUrl || null,
      };

      // Gọi API tạo mới máy bay
      await axiosInstance.post("/api/airplanes", newPlane);
      toast.success('Plane created successfully!');
    } catch (err) {
      console.error("Failed to create new plane:", err);
      toast.error('Failed to create new plane!');
    }
  };

  // Chuyển file sang Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Plane</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {planeInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  {input.type === "select" ? (
                    <select
                      id={input.id}
                      value={info[input.id] || ""}
                      onChange={handleChange}
                    >
                      {input.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={input.type}
                      id={input.id}
                      placeholder={input.placeholder}
                      value={info[input.id] || ""}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}

              <button onClick={handleClick} >Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPlane;
