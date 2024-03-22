import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      setAlertMessage('Please fill in all fields.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`https://api.escuelajs.co/api/v1/categories/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('https://api.escuelajs.co/api/v1/categories/', formData);
      }
      setFormData({ name: '', image: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, image: category.image });
    setEditingId(category.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.escuelajs.co/api/v1/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Categories</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            className="form-control"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>
      {alertMessage && <div className="alert alert-danger mt-3">{alertMessage}</div>}
      <ul className="list-group mt-3">
        {categories.map((category) => (
          <li className="list-group-item d-flex justify-content-between" key={category.id}>
            <div>
              <img src={category.image} alt={category.name} style={{ maxWidth: '100px' }} />
              <span className="ml-3">{category.name}</span>
            </div>
            <div>
              <button
                className="btn btn-warning mr-2"
                onClick={() => handleEdit(category)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(category.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
