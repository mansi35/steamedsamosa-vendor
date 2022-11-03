import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import EditIcon from '@mui/icons-material/Edit';
import { withSnackbar } from 'notistack';
import { Box, CircularProgress } from '@mui/material';
import avatar from '../../assets/avatar-placeholder.png';
import { updateProfile, uploadFile } from '../../api';
import './EditProfilePage.scss';

function EditProfilePage({ enqueueSnackbar }) {
  const user = JSON.parse(localStorage.getItem('profile'))?.user;
  const [loading, setLoading] = useState({ display: 'none' });
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: user.displayName?.split(' ')[0],
    lastName: user.displayName?.split(' ')[1],
    displayName: user.displayName,
    image: user.image,
    bio: user.bio,
    fees: user.fees,
    degrees: user.degrees ? user.degrees.split('$') : [],
    pronoun: user.pronoun,
    experience: user.experience,
    kindOfProfessional: user.kindOfProfessional,
    speciality: user.speciality ? user.speciality.split('$') : [],
    languages: user.languages ? user.languages.split('$') : [],
    sessionDuration: user.sessionDuration,
  });

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const fileInputChangeHandler = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = (image) => {
    const formData = new FormData();
    formData.append('files', image);
    uploadFile(formData)
      .then((response) => {
        setProfileData({ ...profileData, image: response.data[0] });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading({ display: 'inline' });
    updateProfile({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      displayName: profileData.firstName + ' ' + profileData.lastName,
      image: profileData.image,
      bio: profileData.bio,
      fees: profileData.fees,
      degrees: profileData.degrees ? profileData.degrees.join('$') : '',
      pronoun: profileData.pronoun,
      experience: profileData.experience,
      kindOfProfessional: profileData.kindOfProfessional,
      speciality: profileData.speciality ? profileData.speciality.join('$') : '',
      languages: profileData.languages ? profileData.languages.join('$') : '',
      sessionDuration: profileData.sessionDuration,
    }).then((userData) => {
      const loggedInUser = JSON.parse(localStorage.getItem('profile'));
      loggedInUser.user = userData.data;
      localStorage.setItem('profile', JSON.stringify(loggedInUser));
      setLoading({ display: 'none' });
      enqueueSnackbar('Profile Updated Successfully!', { variant: 'success' });
      navigate('/');
    });
  };

  const handleAddSpeciality = (tag) => setProfileData({ ...profileData, speciality: [...profileData.speciality, tag] });
  const handleAddLanguage = (tag) => setProfileData({ ...profileData, languages: [...profileData.languages, tag] });
  const handleAddDegree = (tag) => setProfileData({ ...profileData, degrees: [...profileData.degrees, tag] });

  const handleDeleteSpeciality = (tagToDelete) => setProfileData({ ...profileData, speciality: profileData.speciality.filter((tag) => tag !== tagToDelete) });
  const handleDeleteLanguage = (tagToDelete) => setProfileData({ ...profileData, languages: profileData.languages.filter((tag) => tag !== tagToDelete) });
  const handleDeleteDegree = (tagToDelete) => setProfileData({ ...profileData, degrees: profileData.degrees.filter((tag) => tag !== tagToDelete) });

  return (
    <div className="editProfilePage">
      <h1 className="overview__heading">Edit Profile,</h1>
      <h2 className="overview__tagline ">Edit your profile and view how your clients would see you</h2>
      <form className="editProfilePage__form">
        <div>
          <div className="editProfile__row">
            <div className="editProfile__image">
              <img src={user.image ? user.image.url : avatar} alt="Test" className="image-size" />
              <label className="image-edit">
                <EditIcon />
                <input type="file" style={{ display: 'none' }} onChange={fileInputChangeHandler} />
              </label>
            </div>
            <div className="editProfile__input">
              <label htmlFor="meetLink">Meet Link</label>
              <br />
              <input type="link" id="" name="meetLink" placeholder="https://meet.google.com" className="input-control-field" />
            </div>
          </div>
          <div className="editProfile__row">
            <div className="editProfile__input">
              <label htmlFor="firstName">First Name</label>
              <br />
              <input type="text" id="" name="firstName" placeholder="Dr. Regina" value={profileData.firstName} onChange={handleChange} className="input-control-field" />
            </div>
            <div className="editProfile__input">
              <label htmlFor="lastName">Last Name</label>
              <br />
              <input type="text" id="" name="lastName" placeholder="D'cruz" value={profileData.lastName} onChange={handleChange} className="input-control-field" />
            </div>
          </div>
          <div className="editProfile__row">
            <div className="editProfile__input">
              <label htmlFor="experience">Years of Experience</label>
              <br />
              <input type="number" id="" name="experience" placeholder="12" value={profileData.experience} onChange={handleChange} className="input-control-field" />
            </div>
            <div className="editProfile__input">
              <label htmlFor="fees">Therapy Fees (in ₹)</label>
              <br />
              <input type="number" id="" name="fees" placeholder="₹1000" value={profileData.fees} onChange={handleChange} className="input-control-field" />
            </div>
          </div>
        </div>
        <div>
          <div className="about">About</div>
        </div>
        <div className="editProfile__row">
          <div className="editProfile__input">
            <label htmlFor="pronoun">Pronouns</label>
            <br />
            <input type="text" id="" name="pronoun" placeholder="Eg. His/Him , She/Her" value={profileData.pronoun} onChange={handleChange} className="input-control-field" />
          </div>
          <div className="editProfile__input">
            <label htmlFor="sessionDuration">Session Duration (in minutes)</label>
            <br />
            <input type="number" id="" name="sessionDuration" placeholder="Eg. 60" value={profileData.sessionDuration} onChange={handleChange} className="input-control-field" />
          </div>
        </div>
        <div className="editProfile__row">
          <div className="editProfile__input">
            <label htmlFor="degrees">Education</label>
            <ChipInput
              value={profileData.degrees}
              onAdd={handleAddDegree}
              onDelete={handleDeleteDegree}
              variant="outlined"
              className="input-control-chip-field"
              placeholder="Press enter to add more degrees"
            />
          </div>
          <div className="editProfile__input">
            <label htmlFor="languages">Languages</label>
            <ChipInput
              value={profileData.languages}
              onAdd={handleAddLanguage}
              onDelete={handleDeleteLanguage}
              variant="outlined"
              className="input-control-chip-field"
              placeholder="Press enter to add more languages"
            />
          </div>
        </div>
        <div className="editProfile__row">
          <div className="editProfile__specialization">
            <label htmlFor="speciality">Specialization</label>
            <ChipInput
              value={profileData.speciality}
              onAdd={handleAddSpeciality}
              onDelete={handleDeleteSpeciality}
              variant="outlined"
              className="specialization__field"
              placeholder="Press enter to add more specialities"
            />
          </div>
        </div>
        <div>
          <div className="editProfile__description">
            <label htmlFor="bio">Description</label>
            <br />
            <textarea id="" name="bio" placeholder="Tell us about yourself..." value={profileData.bio} onChange={handleChange} className="input-control-field description" />
          </div>
        </div>
        <div className="editProfile__submit">
          <button onClick={onSubmit}>
            Save
            <Box sx={loading}>
              <CircularProgress style={{ color: '#FFFFFF' }} />
            </Box>
          </button>
        </div>
      </form>
    </div>
  );
}

export default withSnackbar(EditProfilePage);
