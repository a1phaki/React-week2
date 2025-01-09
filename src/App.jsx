import  {  useState } from 'react'
import axios from 'axios'


import './App.css'

function App() {
  const base_url = import.meta.env.VITE_BASE_URL;
  const api_path = import.meta.env.VITE_API_PATH;

  const [formData, setFormData] = useState({
    username : '',
    password : ''
  });

  const [isAuth, setIsAuth] = useState(false);

  const [products,setProducts] = useState([]);
  const [selectProduct,setSelectProduct] = useState(null);

  const handleInputChange = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name] : value
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();

    if(!formData.username || !formData.password){
      alert('請輸入使用者信箱和密碼');
      return
    }
    
    console.log(formData);
    try {
      const res = await axios.post(`${base_url}/admin/signin`,formData);
      const config = {
        headers: { Authorization: res.data.token },
      };
      loginCheck(config);
      getProducts(config);
    } catch (error) {
      console.log(error);
    }
  }

  const loginCheck = async (config)=>{
    try {
      const res = await axios.post(`${base_url}/api/user/check`,{},config);
      setIsAuth(res.data.success);
    } catch (error) {
      console.log(error);
    }
  }

  const getProducts = async (config)=>{
    try {
      const res = await axios.get(`${base_url}/api/${api_path}/admin/products/all`,config);
      console.log(res.data.products);
      setProducts(Object.values(res.data.products));
    } catch (error) {
      console.log(error);  
    }
    
  }  

  return (
    <>
      {isAuth ?
        <div className="container mt-5">
          <div className="row">
              <div className="col-md-6">
                  <h2>產品列表</h2>
                  <table className='table'>
                      <thead>
                          <tr>
                              <th>產品名稱</th>
                              <th>原價</th>
                              <th>售價</th>
                              <th>是否啟用</th>
                              <th>查看細節</th>
                          </tr>
                      </thead>
                      <tbody>
                          {products.map(item=>{
                              return(
                                  <tr key={item.id}>
                                      <td>{item.title}</td>
                                      <td>{item.price}</td>
                                      <td>{item['origin_price']}</td>
                                      <td>{item['is_enabled']?'啟用':'不啟用'}</td>
                                      <td><button className='btn btn-outline-warning' onClick={()=>setSelectProduct(item)}>查看細節</button></td>
                                  </tr>
                              )
                          })}
                      </tbody>
                  </table>
              </div>
              <div className='col-md-6'>
                  <h2>單一產品細節</h2>
                  { selectProduct ?
                      (<div className="card" >
                          <img src={selectProduct.imageUrl} className="card-img-top primary-image" alt={selectProduct.title} />
                          <div className="card-body">
                            <h5 className="card-title">{selectProduct.title} <span className='badge bg-warning'>{selectProduct.category}</span> </h5>
                            <p className="card-text">商品描述：{selectProduct.description}</p>
                            <p className="card-text">商品內容：{selectProduct.content}</p>
                            <p className="card-text"><del className='text-secondary'>{selectProduct['origin_price']}</del> 元/ {selectProduct.price} 元</p>
                            <h5 className='card-subtitle mb-3'>更多圖片:</h5>
                            <div className="d-flex flex-wrap">
                              {selectProduct.imagesUrl.map((item,index) => (<img src={item} key={index} className="images" alt='附圖' />) )}
                            </div>
                          </div>
                        </div>) :
                      (<p className='text-secondary'>請選擇一個商品查看</p>)
                  }
              </div>
          </div>
      </div>
      :
      <div className='container'>
        <h1>請登入</h1>
        <form className='form g-3' onSubmit={handleSubmit}>
          <div className="mb-3 row">
            <label htmlFor="username" className='col-form-label col-2 text-start'>使用者信箱{formData.username}</label>
            <input type="email" id='username' className='col-form-control col-10' name='username' onChange={handleInputChange} required />
          </div>
          <div className="mb-3 row">
            <label htmlFor="password" className='col-form-label col-2 text-start'>密碼{formData.password}</label>
            <input type="password" id='password' className='col-form-control col-10' name='password' onChange={handleInputChange} required />
          </div>
          <div className="mb-3 row">
            <button type='submit' className='btn btn-warning'>登入</button>
          </div>
        </form>
      </div>}
    </>
  )
}

export default App
