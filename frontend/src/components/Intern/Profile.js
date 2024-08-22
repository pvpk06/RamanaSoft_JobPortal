import React, { useState, useRef, useEffect } from 'react';
import { Container, Grid, Typography, Button } from '@mui/material';
import { Form, Row, Col } from 'react-bootstrap';
import avatar2 from '../images/avatar2.avif';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import apiService from '../../apiService';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    candidateID: '',
    fullName: '',
    email: '',
    mobileNo: '',
    altMobileNo: '',
    domain: '',
    belongedToVasaviFoundation: '',
    address: '',
    batchNo: '',
    modeOfInternship: '',
  });
  const [profileImage, setProfileImage] = useState(avatar2);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const internID = Cookies.get("internID");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    console.log('Fetching profile data for internID:', internID);
    apiService.get(`/intern_data/${internID}`)
      .then(response => {
        console.log('Response status:', response.status);  // Log response status
        return response.data;
      })
      .then(data => {
        console.log('Fetched data:', data);  // Log the fetched data
        if (Array.isArray(data) && data.length > 0) {
          const profileData = data[0];
          setFormData({
            candidateID: profileData.candidateID,
            fullName: profileData.fullName,
            email: profileData.email,
            mobileNo: profileData.mobileNo,
            altMobileNo: profileData.altMobileNo,
            domain: profileData.domain,
            belongedToVasaviFoundation: profileData.belongedToVasaviFoundation,
            address: profileData.address,
            batchNo: profileData.batchNo,
            modeOfInternship: profileData.modeOfInternship,
          });
          setProfileImage(profileData.profile_image || avatar2);
        }
      })
      .catch(error => console.error('Error fetching profile data:', error));
  }, [internID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsEditing(false);

    const updatedData = new FormData();
    Object.keys(formData).forEach(key => {
      updatedData.append(key, formData[key]);
    });

    if (fileInputRef.current.files[0]) {
      updatedData.append('profileImage', fileInputRef.current.files[0]);
    }

    try {
      const response = await apiService.post('/update-profile', updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data;
      if (data.success) {
        console.log('Profile updated successfully:', data);
      } else {
        console.error('Error updating profile:', data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Container>
      <Row className='mt-3'>
        <Col md={3}>
          <div className="text-center flex-column d-flex">
            <img
              src={imagePreview || profileImage}
              alt="Profile"
              className="img-fluid rounded-circle img-thumbnail"
              style={{ width: '300px', height: '300px', objectFit: 'cover', marginTop: "100px" }}
            />
          </div>
        </Col>
        <Col md={8} className='ms-5'>
          <h2 className="mb-4 text-center fw-semibold border rounded p-2">Profile Information <i className="fa-solid fa-id-card"></i>
            <Button
              style={{ marginLeft: "200px" }}
              type="button"
              onClick={isEditing ? handleSave : handleEdit}
            >
              {isEditing ? (<>Save<i className="fa-solid fa-check text-dark fs-5" style={{ marginLeft: "10px", color: "blue" }}></i></>) : (<><i className="fa-solid fa-edit text-dark" style={{ background: "none", height: "20px", width: "30px" }}></i></>)}
            </Button>
          </h2>
          <Form onSubmit={handleSave}>

            <Form.Group controlId="formCandidateID">
              <Form.Label className="fw-bold">Candidate ID</Form.Label>
              <Form.Control
                type="text"
                name="candidateID"
                placeholder="Candidate ID"
                value={formData.candidateID}
                onChange={handleChange}
                disabled
              />
            </Form.Group>

            <Form.Group controlId="formFullName">
              <Form.Label className="fw-bold">Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label className="fw-bold">Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group controlId="formMobileNo">
              <Form.Label className="fw-bold">Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                name="mobileNo"
                placeholder="+1-234-567-8900"
                value={formData.mobileNo}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group controlId="formDomain">
              <Form.Label className="fw-bold">Domain</Form.Label>
              <Form.Control
                type="text"
                name="domain"
                placeholder="Software Development"
                value={formData.domain}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group controlId="formBelongedToVasaviFoundation">
              <Form.Label className="fw-bold">Belonged to Vasavi Foundation</Form.Label>
              <Form.Control
                type="text"
                name="belongedToVasaviFoundation"
                placeholder="Yes/No"
                value={formData.belongedToVasaviFoundation}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group controlId="formAddress">
              <Form.Label className="fw-bold">Address</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                name="address"
                placeholder="123 Main St, City, Country"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group controlId="formBatchNo">
              <Form.Label className="fw-bold">Batch Number</Form.Label>
              <Form.Control
                type="text"
                name="batchNo"
                value={formData.batchNo}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
