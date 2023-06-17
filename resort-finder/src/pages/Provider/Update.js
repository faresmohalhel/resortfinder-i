import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Update.css";

const Update = () => {
  const [resort, setResort] = useState({
    name: "",
    description: "",
    price: null,
    photo: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const resortId = location.pathname.split("/")[2];
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/resort/" + resortId, resort);
      navigate("/provider");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setResort((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(resort);
  return (
    <div className="Update-form">
      <h1>Update resort</h1>
      <input
        type="text"
        placeholder="title"
        onChange={handleChange}
        name="name"
      />
      <select
        id="city"
        onChange={handleChange}
        name="city"
        className="filter-option-select"
      >
        <option value="">All Cities</option>
        <option value="Zarqa">Zarqa</option>
        <option value="Amman">Amman</option>
        <option value="Mafraq">Mafraq</option>
        <option value="Aqaba">Aqaba</option>
        <option value="Ajloun">Ajloun</option>
        <option value="Irbid">Irbid</option>
        <option value="Balqa">Balqa</option>
        <option value="Madaba">Madaba</option>
        <option value="Jarash">Jarash</option>
        <option value="Tafelah">Tafelah</option>
        <option value="Karak">Karak</option>
        <option value="Maan">Maan</option>
      </select>
      <input
        type="text"
        placeholder="description"
        onChange={handleChange}
        name="description"
      />
      <input
        type="number"
        placeholder="price"
        onChange={handleChange}
        name="price"
      />
      <input
        type="text"
        placeholder="cover"
        onChange={handleChange}
        name="photo"
      />
      <button onClick={handleClick}>Update</button>
    </div>
  );
};

export default Update;
