import React, { useState } from 'react';
import Layout from './../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { firebase, auth } from './Firebase';
import '../../styles/AuthStyles.css';
import { PutObjectCommand, S3Client  } from "@aws-sdk/client-s3";
// import dotenv from 'dotenv'
const Register = () => {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const [show, setshow] = useState(false);
  // Rest of your code...
  const [final, setfinal] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [answer, setAnswer] = useState('');
  const [userRef, setUserRef] = useState('');
  const [Okk, setOkk] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const client = new S3Client({
    credentials: {
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID, // store it in .env file to keep it safe
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    },
    region: process.env.REACT_APP_REGION,
  });
  const [isSeller, setIsSeller] = useState(false);
  // form function
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };
  const main = async () => {
    try {
      const command = new PutObjectCommand({
        Bucket: "flipkarbucket",
        Key: `users/${image.name}`,
        Body: image,
      });
      const response = await client.send(command);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };
  const handleSellerCheckboxChange = () => {
    setIsSeller(!isSeller);
  };
  const getObjectUrl = () => {
    return `https://flipkarbucket.s3.ap-south-1.amazonaws.com/users/${image.name}`;
  }
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isChecked) {
        await main();
        const imgUrl = await getObjectUrl();
        console.log(imgUrl);
        const res = await axios.post('/api/v1/auth/register', {
          name,
          email,
          password,
          phone,
          address,
          answer,
          isSeller,
          imgUrl,
          userRef
        });
        console.log(res);
        if (res && res.data.success) {
          toast.success(res.data && res.data.message);
          navigate('/login');
        } else {
          toast.error(res.data.message);
        }
      } else {
        toast.error('please Enter OTP');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };
  const signin = () => {
    if (phone === '' || phone.length < 10) return;

    let verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    auth
      .signInWithPhoneNumber(phone, verify)
      .then(result => {
        setfinal(result);
        alert('code sent');
        setshow(true);
      })
      .catch(err => {
        alert(err);
        window.location.reload();
      });
  };
  const ValidateOtp = () => {
    if (otp === null || final === null) return;
    final
      .confirm(otp)
      .then(result => {
        // success
        console.log('====================================');
        console.log('succ');
        console.log('====================================');
        toast.success('OTP Verified👍👍');
        setOkk(true);
      })
      .catch(err => {
        alert('Wrong code');
        navigate('/');
      });
  };

  // const handlePhone = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post("/api/v1/auth/phone", {
  //       phone,
  //     });
  //     if (res && res.data.success) {
  //       toast.success(res.data && res.data.message);
  //       navigate("/login");
  //     } else {
  //       toast.error(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong");
  //   }
  // };

  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container" style={{ minHeight: '90vh' }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Name"
              required
              autoFocus
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-3">
            <input
              // type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Phone"
              required
            />
          </div>
          <div className="mb-3">
            <input
              placeholder="Upload your Image"
              type="file"
              onChange={handleImageChange}
              className="form-control"
              id="imageUpload"
              accept="image/*"
            />
          </div>
          <div id="recaptcha-container"></div>{' '}
          {/* Add this div for reCAPTCHA */}
          {/* <button onClick={signin}> SEND OTP</button>{" "}
          <div style={{ display: show ? "block" : "none" }}>
            <input
              type="text"
              placeholder={"Enter your OTP"}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
            ></input>
            <br />
            <br />
            <button onClick={ValidateOtp}>Verify</button>
          </div> */}
          <div className="mb-3">
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Address"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="What is Your Favorite sports"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={userRef}
              onChange={e => setUserRef(e.target.value)}
              className='form-control'
              id="exampleInputEmail1"
              placeholder='Enter User Referral Code'
            />
          </div>
          {/* <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              required
            />
            I agree to the{' '}
            {/* <button onClick={navigate("/termsandconditions")}>
              Terms and Conditions
            </button> */}
          {/* </label> */}
          <br />
          <label>
            <input
              type="checkbox"
              checked={isSeller}
              onChange={handleSellerCheckboxChange}
            />
            Are you a seller ?
          </label>
          <br />
          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
      {/* </div> */}
    </Layout>
  );
};

export default Register;
