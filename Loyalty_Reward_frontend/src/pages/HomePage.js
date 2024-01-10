import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useCart } from '../context/cart';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from './../components/Layout/Layout';
import { AiOutlineReload } from 'react-icons/ai';
import '../styles/Homepage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/product-count');
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter(c => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post('/api/v1/product/product-filters', {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const resetFilters = () => {
    setChecked([]);
    setRadio([]);
    getAllProducts();
  };

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setChecked([...checked, id]);
    } else {
      setChecked(checked.filter(c => c !== id));
    }
  };

  return (
    <Layout title={'Style Fusion - Best offers '}>
      {/* banner image */}
      <div className="banner">
        {/* <p>BLOCKCHAIN BASED DONATION PLATFORM</p> */}
        <h1>Inspiring Shopping, Seamless Living</h1>
      </div>
      {/* <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      /> */}
      {/* banner image */}
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map(c => (
              <Checkbox
                key={c._id}
                checked={checked.includes(c._id)}
                onChange={e => handleCheckboxChange(e, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group value={radio} onChange={e => setRadio(e.target.value)}>
              {Prices?.map(p => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
            <button className="btn btn-secondary" onClick={() => setRadio([])}>
              Clear Selection
            </button>
          </div>
          <div className="d-flex flex-column">
            <button className="btn btn-danger" onClick={resetFilters}>
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map(p => (
              <div
                className="card m-2"
                key={p._id}
                style={{
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={e =>
                  (e.currentTarget.style.boxShadow =
                    '0 4px 8px rgba(0, 0, 0, 0.1)')
                }
                onMouseOut={e => (e.currentTarget.style.boxShadow = '')}
              >
                <img
                  src={p.imgUrl}
                  className="card-img-top"
                  alt={p.name}
                  onClick={() => navigate(`/product/${p.slug}`)}
                  style={{ cursor: 'pointer' }} // To show a pointer cursor when hovering over the image
                />

                <div className="card-body">
                  <div
                    className="card-name-price d-flex justify-content-between align-items-center"
                    style={{ marginBottom: '10px' }}
                  >
                    <h5 className="card-title">{p.name.substring(0, 20)}</h5>
                    <h5
                      className="card-title card-price"
                      style={{ fontWeight: 'bold' }}
                    >
                      {p.price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'INR',
                      })}
                    </h5>
                  </div>
                  <p className="card-text">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div
                    className="card-actions d-flex justify-content-between align-items-center"
                    style={{ marginTop: '10px' }}
                  >
                    <button
                      className="btn btn-info"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-dark"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          'cart',
                          JSON.stringify([...cart, p]),
                        );
                        toast.success('Item Added to cart');
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={e => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  'Loading ...'
                ) : (
                  <>
                    {' '}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
